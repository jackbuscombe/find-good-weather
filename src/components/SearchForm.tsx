import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange, DateRangePicker } from "react-date-range";
import { useState, useEffect, useRef, Fragment } from "react";
import { FaBed, FaRegCalendarAlt, FaUser } from "react-icons/fa";
import { BiUser, BiChevronDown } from "react-icons/bi";
import { RiSunFoggyLine, RiSettingsLine, RiCloseLine } from "react-icons/ri";
import { TbLayoutList, TbMap } from "react-icons/tb";
import { MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineCalendar, AiOutlineHome } from "react-icons/ai";
import { Select, Tooltip } from "@mantine/core";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useStore } from "../components/appStore";
import SearchFormField from "./SearchFormField";
import SettingsDropdown from "./SettingsDropdown";
import SearchFieldPeople from "./SearchFields/SearchFieldPeople";
import SearchFieldDesiredWeather from "./SearchFields/SearchFieldDesiredWeather";
import { add, format } from "date-fns";
import coordinatesToISO from "../utils/coordinatesToISO";
import { Popover, Transition } from "@headlessui/react";

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
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult>();
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();
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
  const setIsLocationModalOpen = useStore(
    (state) => state.setIsLocationModalOpen
  );
  const setIsViewingHome = useStore((state) => state.setIsViewingHome);

  const selectedCityName = useStore((state) => state.selectedCityName);
  const setSelectedCityName = useStore((state) => state.setSelectedCityName);
  const selectedCountryName = useStore((state) => state.selectedCountryName);
  const setSelectedCountryName = useStore(
    (state) => state.setSelectedCountryName
  );
  const selectedCityWeatherData = useStore(
    (state) => state.selectedCityWeatherData
  );
  const setSelectedCityWeatherData = useStore(
    (state) => state.setSelectedCityWeatherData
  );
  const searchedCityLat = useStore((state) => state.searchedCityLat);
  const setSearchedCityLat = useStore((state) => state.setSearchedCityLat);
  const searchedCityLong = useStore((state) => state.searchedCityLong);
  const setSearchedCityLong = useStore((state) => state.setSearchedCityLong);
  const selectedLocationId = useStore((state) => state.selectedLocationId);
  const setSelectedLocationId = useStore(
    (state) => state.setSelectedLocationId
  );

  useOutsideAlerter(datepickerWrapperRef, "datepicker");
  useOutsideAlerter(settingsWrapperRef, "settings");

  const [libraries] = useState<
    ("places" | "drawing" | "geometry" | "localContext" | "visualization")[]
  >(["places"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
    libraries,
  });

  const handleSelect = (ranges: any) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(add(ranges.selection.startDate, { days: 13 }));
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
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          element == "datepicker"
        ) {
          setIsDatepickerOpen(false);
        }
        if (
          ref.current &&
          !ref.curent?.contains(event.target) &&
          element == "settings"
        ) {
          setIsSettingsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const onLoad = (autoC: google.maps.places.Autocomplete) =>
    setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (!autocomplete) return;
    const lat = autocomplete?.getPlace()?.geometry?.location?.lat();
    const lng = autocomplete?.getPlace()?.geometry?.location?.lng();
    const cityName = autocomplete?.getPlace()?.name ?? "";
    const addressComponentsArray = autocomplete?.getPlace()?.address_components;
    console.log("Address Components Array", autocomplete.getPlace());
    const countryName =
      addressComponentsArray?.[addressComponentsArray.length - 1]?.long_name ??
      "";
    const placeId = autocomplete?.getPlace()?.place_id ?? "";

    if (lat && lng) {
      setSelectedCityName(cityName);
      setSelectedCountryName(countryName);
      setSearchedCityLat(lat);
      setSearchedCityLong(lng);
      setSelectedLocationId(placeId);
    }
    // setIsViewingHome(false);
  };

  const setToUserLocation = () => {
    setSearchedCityLat(userLat);
    setSearchedCityLong(userLong);
    setIsViewingHome(true);
  };

  useEffect(() => {
    if (!startDate) return;
    document.getElementById("close_date_popover")?.click();
  }, [startDate]);

  return (
    <div className="relative z-30 px-4">
      <div
        className={`flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center md:border-2 p-4 rounded-lg font-mono md:shadow-sm bg-white whitespace-nowrap ${className}`}
      >
        {isLoaded && (
          <SearchFormField
            title="Where"
            icon={
              <MdOutlineLocationOn className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />
            }
          >
            <Autocomplete
              onPlaceChanged={onPlaceChanged}
              onLoad={onLoad}
              fields={["place_id", "geometry", "address_components", "name"]}
            >
              <div className="flex space-x-4">
                <input
                  ref={destinationRef}
                  className="w-4/5 border-none outline-none bg-transparent flex-grow text-black font-bold placeholder-black text-lg cursor-pointer truncate"
                  type="text"
                  placeholder={searchInput || userCity}
                />

                <div
                  onClick={setToUserLocation}
                  className="text-gray-500 bg-gray-200 hover:bg-gray-100 p-2 rounded-full cursor-pointer transition transform ease-in-out"
                >
                  <AiOutlineHome />
                </div>
              </div>
            </Autocomplete>
          </SearchFormField>
        )}

        {/* <SearchFormField title="Desired Weather" icon={<RiSunFoggyLine className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />}>
					<SearchFieldDesiredWeather options={["clear", "rainy", "snow"]} />
				</SearchFormField> */}

        <div ref={datepickerWrapperRef}>
          <SearchFormField
            title="When"
            icon={
              <AiOutlineCalendar className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />
            }
          >
            <Popover>
              <Popover.Button>
                <div className="flex items-center font-mono outline-none border-none">
                  <input
                    placeholder={`${format(startDate, "dd MMM yy")} - ${format(
                      endDate,
                      "dd MMM yy"
                    )}`}
                    className="border-none outline-none bg-transparent flex-grow text-black font-bold placeholder-black text-lg cursor-pointer"
                    type="text"
                  />
                  <BiChevronDown
                    className="h-5 w-5 text-gray-400 ml-2"
                    aria-hidden="true"
                  />
                </div>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="fixed top-0 left-0 sm:absolute sm:top-auto sm:left-auto z-20 bg-white border rounded shadow-black shadow-2xl">
                  <DateRange
                    ranges={[selectionRange]}
                    minDate={new Date()}
                    rangeColors={["#253adc"]}
                    maxDate={add(new Date(), { days: 300 })}
                    months={10}
                    direction="vertical"
                    //   scroll={{ enabled: true }}
                    onChange={handleSelect}
                    className="h-72 overflow-y-scroll"
                    moveRangeOnFirstSelection={true}
                    retainEndDateOnFirstSelection={true}
                  />
                  <div className="flex justify-center py-3 border-t">
                    <Popover.Overlay>
                      <button
                        id="close_date_popover"
                        className="bg-blue-500 text-white font-semibold p-3 rounded"
                      >
                        Done
                      </button>
                    </Popover.Overlay>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          </SearchFormField>
        </div>

        <Tooltip
          label="Our algorithm draws nearby cities with a population over 90,000"
          withArrow
        >
          <div
            className={`hidden sm:flex justify-center items-center text-white bg-[#445fc8] hover:bg-blue-400 h-8 w-8 rounded-full cursor-default transition transform ease-in-out`}
          >
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
