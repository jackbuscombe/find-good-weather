import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { useState, useEffect, useRef, Fragment } from "react";
import { FaBed, FaRegCalendarAlt, FaUser } from "react-icons/fa";
import { BiUser, BiChevronDown } from "react-icons/bi";
import { RiSunFoggyLine, RiSettingsLine, RiCloseLine } from "react-icons/ri";
import { TbLayoutList, TbMap } from "react-icons/tb";
import { MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineCalendar, AiOutlineHome } from "react-icons/ai";
import { Select, Tooltip } from "@mantine/core";
import ResultsTable from "../components/ResultsTable";
import { useJsApiLoader, GoogleMap, Autocomplete, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useStore } from "../components/appStore";
import SearchFormField from "./SearchFormField";
import SettingsDropdown from "./SettingsDropdown";
import SearchFieldPeople from "./SearchFields/SearchFieldPeople";
import SearchFieldDesiredWeather from "./SearchFields/SearchFieldDesiredWeather";
import { format } from "date-fns";
import coordinatesToISO from "../utils/coordinatesToISO";

type Props = {
	className?: string;
	refetch: any;
};

function SearchForm({ className, refetch }: Props) {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const userLat = useStore((state) => state.userLat);
	const userLong = useStore((state) => state.userLong);
	const userCity = useStore((state) => state.userCity);
	const viewType = useStore((state) => state.viewType);
	const setViewType = useStore((state) => state.setViewType);
	const [isDatepickerOpen, setIsDatepickerOpen] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult>();
	const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>();
	const [distance, setDistance] = useState("");
	const [duration, setDuration] = useState("");
	const originRef = useRef<HTMLInputElement>(null);
	const destinationRef = useRef<HTMLInputElement>(null);
	const settingsWrapperRef = useRef<HTMLInputElement>(null);
	const [noOfGuests, setNoOfGuests] = useState(1);
	const datepickerWrapperRef = useRef(null);
	const startDate = useStore((state) => state.startDate);
	const setStartDate = useStore((state) => state.setStartDate);
	const endDate = useStore((state) => state.endDate);
	const setEndDate = useStore((state) => state.setEndDate);
	const isLocationModalOpen = useStore((state) => state.isLocationModalOpen);
	const setIsLocationModalOpen = useStore((state) => state.setIsLocationModalOpen);

	const selectedCityName = useStore((state) => state.selectedCityName);
	const setSelectedCityName = useStore((state) => state.setSelectedCityName);
	const selectedCountryName = useStore((state) => state.selectedCountryName);
	const setSelectedCountryName = useStore((state) => state.setSelectedCountryName);
	const selectedCityWeatherData = useStore((state) => state.selectedCityWeatherData);
	const setSelectedCityWeatherData = useStore((state) => state.setSelectedCityWeatherData);
	const selectedCityLat = useStore((state) => state.selectedCityLat);
	const setSelectedCityLat = useStore((state) => state.setSelectedCityLat);
	const selectedCityLong = useStore((state) => state.selectedCityLong);
	const setSelectedCityLong = useStore((state) => state.setSelectedCityLong);
	const selectedLocationId = useStore((state) => state.selectedLocationId);
	const setSelectedLocationId = useStore((state) => state.setSelectedLocationId);

	// useOutsideAlerter(datepickerWrapperRef, "datepicker");
	// useOutsideAlerter(settingsWrapperRef, "settings");

	const [libraries] = useState<("places" | "drawing" | "geometry" | "localContext" | "visualization")[]>(["places"]);
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
		libraries,
	});

	const handleSelect = (ranges: any) => {
		setStartDate(ranges.selection.startDate);
		setEndDate(ranges.selection.endDate);
	};

	const selectionRange = {
		startDate,
		endDate,
		key: "selection",
	};

	const resetInput = () => {
		setSearchInput("");
	};

	function useOutsideAlerter(ref: any, element: string) {
		useEffect(() => {
			function handleClickOutside(event: any) {
				if (ref.current && !ref.current.contains(event.target) && element == "datepicker") {
					setIsDatepickerOpen(false);
				}
				if (ref.current && !ref.curent.contains(event.target) && element == "settings") {
					setIsSettingsOpen(false);
				}
			}
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref]);
	}

	const onLoad = (autoC: google.maps.places.Autocomplete) => setAutocomplete(autoC);

	const onPlaceChanged = () => {
		if (!autocomplete) return;
		const lat = autocomplete?.getPlace()?.geometry?.location?.lat();
		const lng = autocomplete?.getPlace()?.geometry?.location?.lng();
		const cityName = autocomplete?.getPlace()?.name ?? "";
		const addressComponentsArray = autocomplete?.getPlace()?.address_components;
		console.log("Address Components Array", autocomplete.getPlace());
		const countryName = addressComponentsArray?.[addressComponentsArray.length - 1]?.long_name ?? "";
		const placeId = autocomplete?.getPlace()?.place_id ?? "";

		if (lat && lng) {
			setSelectedCityName(cityName);
			setSelectedCountryName(countryName);
			setSelectedCityLat(lat);
			setSelectedCityLong(lng);
			setSelectedLocationId(placeId);
		}
	};

	const setToUserLocation = () => {
		setSelectedCityLat(userLat);
		setSelectedCityLong(userLong);
	};

	useEffect(() => {
		if (!userCity) return;
	}, [userCity]);

	return (
		<div className="z-30 px-4">
			<div className={`flex space-x-4 items-center md:border-2 p-4 rounded-lg font-mono md:shadow-sm bg-white whitespace-nowrap ${className}`}>
				{isLoaded && (
					<SearchFormField title="Where" icon={<MdOutlineLocationOn className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />}>
						<Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad} fields={["place_id", "geometry", "address_components", "name"]}>
							<div className="flex space-x-4">
								<input ref={destinationRef} className="w-4/5 border-none outline-none bg-transparent flex-grow text-black font-bold placeholder-black text-lg cursor-pointer truncate" type="text" placeholder={searchInput || userCity} />

								<div onClick={setToUserLocation} className="text-gray-500 bg-gray-200 hover:bg-gray-100 p-2 rounded-full cursor-pointer transition transform ease-in-out">
									<AiOutlineHome />
								</div>
							</div>
						</Autocomplete>
					</SearchFormField>
				)}

				{/* <SearchFormField title="Desired Weather" icon={<RiSunFoggyLine className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />}>
					<SearchFieldDesiredWeather options={["clear", "rainy", "snow"]} />
				</SearchFormField>

				<div ref={datepickerWrapperRef}>
					<SearchFormField title="When" icon={<AiOutlineCalendar className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />}>
						<>
							<div className="flex items-center font-mono" onClick={() => setIsDatepickerOpen(true)}>
								<input placeholder={`${format(startDate, "dd MMM yy")} - ${format(endDate, "dd MMM yy")}`} className="border-none outline-none bg-transparent flex-grow text-black font-bold placeholder-black text-lg cursor-pointer" type="text" />
								<BiChevronDown className="h-5 w-5 text-gray-400 ml-2" aria-hidden="true" />
							</div>
							{isDatepickerOpen && (
								<div className="absolute bg-white font-sans mx-auto mt-2 z-40">
									<DateRangePicker ranges={[selectionRange]} minDate={new Date()} rangeColors={["#253adc"]} onChange={handleSelect} />
									<div className="flex space-x-3 justify-center py-3">
										<button onClick={() => setIsDatepickerOpen(false)} className="bg-transparent border text-gray-500 font-semibold p-3 rounded hover:bg-gray-50">
											Cancel
										</button>
										<button onClick={() => setIsDatepickerOpen(false)} className="bg-blue-500 text-white font-semibold p-3 rounded">
											Done
										</button>
									</div>
								</div>
							)}
						</>
					</SearchFormField>
				</div> */}

				{/* <button
					onClick={() => {
						refetch();
					}}
					className="bg-blue-500 text-white p-4 text-lg font-bold hover:bg-blue-600"
				>
					SHOW ME
				</button> */}

				<Tooltip label="Our algorithm draws nearby cities with a population over 90,000" withArrow>
					<div className={`flex justify-center items-center text-white bg-[#445fc8] hover:bg-blue-400 h-8 w-8 rounded-full cursor-default transition transform ease-in-out`}>
						<p>i</p>
					</div>
					{/* <div onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`text-gray-500 ${isSettingsOpen ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-100 hover:bg-gray-200"} text-2xl p-4 cursor-pointer`}>
						{isSettingsOpen ? <RiCloseLine /> : <RiSettingsLine />}
					</div> */}
				</Tooltip>
			</div>

			<div ref={settingsWrapperRef} className="relative">
				{isSettingsOpen && <SettingsDropdown />}
			</div>
		</div>
	);
}
export default SearchForm;
