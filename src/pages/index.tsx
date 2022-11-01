import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useState, useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useStore } from "../components/appStore";
import LocationModal from "../components/LocationModal";
import SearchForm from "../components/SearchForm";
import ResultsTableVertical from "../components/ResultsTableVertical";
import Map from "../components/Map";

const Home: NextPage = () => {
	const userLat = useStore((state) => state.userLat);
	const userLong = useStore((state) => state.userLong);
	const selectedCityName = useStore((state) => state.selectedCityName);
	const userFullLocationName = useStore((state) => state.userFullLocationName);
	const setUserFullLocationName = useStore((state) => state.setUserFullLocationName);
	const userCity = useStore((state) => state.userCity);
	const setUserCity = useStore((state) => state.setUserCity);
	const userCountry = useStore((state) => state.userCountry);
	const setUserCountry = useStore((state) => state.setUserCountry);
	const userPlaceId = useStore((state) => state.userPlaceId);
	const setUserPlaceId = useStore((state) => state.setUserPlaceId);
	const isLocationModalOpen = useStore((state) => state.isLocationModalOpen);
	const setIsLocationModalOpen = useStore((state) => state.setIsLocationModalOpen);
	const viewType = useStore((state) => state.viewType);

	const [isDatepickerOpen, setIsDatepickerOpen] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult>();
	const [distance, setDistance] = useState("");
	const [duration, setDuration] = useState("");
	const originRef = useRef<HTMLInputElement>(null);
	const destinationRef = useRef<HTMLInputElement>(null);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [noOfGuests, setNoOfGuests] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const datepickerWrapperRef = useRef(null);
	// useOutsideAlerter(datepickerWrapperRef);

	const { data: userLocation, isLoading: isLoadingUserLocation } = trpc.useQuery(["places.getCityFromLatLong", { lat: userLat, long: userLong }], {
		enabled: !!userLat && !!userLong,
		staleTime: Infinity,
		cacheTime: Infinity,
	});

	useEffect(() => {
		if (!userLocation) return;
		setUserPlaceId(userLocation.placeId);
		setUserCity(userLocation.cityName);
		setUserCountry(userLocation.countryName);
		setUserFullLocationName(userLocation.fullLocationName);
	}, [userLocation]);

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
		startDate: startDate,
		endDate: endDate,
		key: "selection",
	};

	const resetInput = () => {
		setSearchInput("");
	};

	function useOutsideAlerter(ref: any) {
		useEffect(() => {
			function handleClickOutside(event: any) {
				if (ref.current && !ref.current.contains(event.target)) {
					setIsDatepickerOpen(false);
				}
			}
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref]);
	}

	const calculateRoute = async () => {
		if (destinationRef.current === null || destinationRef.current.value === "") return;
		const directionsService = new google.maps.DirectionsService();
		const results = await directionsService.route({
			origin: destinationRef.current.value,
			destination: destinationRef.current.value,
			travelMode: google.maps.TravelMode.DRIVING,
		});

		if (!results.routes[0] || !results.routes[0]?.legs[0] || !results.routes[0]?.legs[0]?.distance || !results.routes[0]?.legs[0]?.duration) return;
		setDirectionsResponse(results);
		setDistance(results.routes[0]?.legs[0]?.distance?.text);
		setDuration(results.routes[0]?.legs[0]?.duration?.text);
	};

	return (
		<>
			<Head>
				<title>Find Good Weather</title>
				<meta name="description" content="Find good weather" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col items-center px-1/4 py-12 bg-cover min-h-screen">
				{/* Form */}
				{isLoaded && <SearchForm className="-mt-24" />}

				{isLoaded && viewType === "map" && (
					<div className="w-screen h-screen">
						<Map />
					</div>
				)}

				{isLoaded && viewType === "vertical" && (
					<div className="w-3/4 mt-8 bg-white">
						<ResultsTableVertical />
					</div>
				)}

				{/* {userLat != 0 && userLong != 0 && isLoaded && (
					<div className="h-64 w-64">
						<GoogleMap
							center={{
								lat: userLong,
								lng: userLong,
							}}
							zoom={15}
							mapContainerStyle={{ width: "100%", height: "100%" }}
							options={{
								streetViewControl: false,
								mapTypeControl: false,
								fullscreenControl: false,
							}}
						>
							<Marker
								position={{
									lat: userLong,
									lng: userLong,
								}}
							/>
							{directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
						</GoogleMap>
					</div>
				)} */}
				{isLocationModalOpen && selectedCityName && <LocationModal />}
			</main>
		</>
	);
};

export default Home;
