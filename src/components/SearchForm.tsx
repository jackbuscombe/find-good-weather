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
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);
  const userLat = useStore((state) => state.userLat);
  const userLong = useStore((state) => state.userLong);
  const userCity = useStore((state) => state.userCity);
  const viewType = useStore((state) => state.viewType);
  const setViewType = useStore((state) => state.setViewType);
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
  const isMainBackdropOn = useStore((state) => state.isMainBackdropOn);
  const setIsMainBackdropOn = useStore((state) => state.setIsMainBackdropOn);
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

  const onLoad = (autoC: google.maps.places.Autocomplete) =>
    setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (!autocomplete) return;
    const lat = autocomplete?.getPlace()?.geometry?.location?.lat();
    const lng = autocomplete?.getPlace()?.geometry?.location?.lng();
    const cityName = autocomplete?.getPlace()?.name ?? "";
    const addressComponentsArray = autocomplete?.getPlace()?.address_components;

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
    <div className="relative z-30">
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
            <Popover className="relative">
              {({ open, close }) => (
                <>
                  <Autocomplete
                    onPlaceChanged={onPlaceChanged}
                    onLoad={onLoad}
                    fields={[
                      "place_id",
                      "geometry",
                      "address_components",
                      "name",
                    ]}
                  >
                    <div className="flex space-x-4">
                      <input
                        ref={destinationRef}
                        onFocus={() => {
                          setIsMainBackdropOn(true);
                          setIsLocationPopoverOpen(true);
                        }}
                        onBlur={() => {
                          setIsMainBackdropOn(false);
                          setIsLocationPopoverOpen(false);
                        }}
                        className="w-4/5 border-none outline-none bg-transparent flex-grow text-black font-bold text-lg cursor-pointer truncate"
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
                  <Transition
                    show={isLocationPopoverOpen}
                    enter="transition-opacity duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="w-[350px] lg:w-[500px] shrink-0 bg-white p-6 shadow-xl rounded-xl absolute z-10 border">
                      <p className="font-bold text-lg mb-4">Search a region</p>

                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                        <div
                          onClick={() => {
                            setSearchedCityLat(-8.7832);
                            setSearchedCityLong(34.5085);
                            setSearchInput("Africa");
                            setIsViewingHome(false);
                          }}
                          className="flex flex-col space-y-2 group"
                        >
                          <img
                            className="aspect-square object-cover rounded-xl group-hover:outline outline-1"
                            src="/continent_images/africa.jpg"
                            alt=""
                          />
                          <p>Africa</p>
                        </div>
                        <div
                          onClick={() => {
                            setSearchedCityLat(34.0479);
                            setSearchedCityLong(100.6197);
                            setSearchInput("Asia");
                            setIsViewingHome(false);
                          }}
                          className="flex flex-col space-y-2 group"
                        >
                          <img
                            className="aspect-square object-cover rounded-xl group-hover:outline outline-1"
                            src="/continent_images/asia.jpg"
                            alt=""
                          />
                          <p>Asia</p>
                        </div>
                        <div
                          onClick={() => {
                            setSearchedCityLat(-25.2744);
                            setSearchedCityLong(133.7751);
                            setSearchInput("Australia");
                            setIsViewingHome(false);
                          }}
                          className="flex flex-col space-y-2 group"
                        >
                          <img
                            className="aspect-square object-cover rounded-xl group-hover:outline outline-1"
                            src="/continent_images/australia.jpg"
                            alt=""
                          />
                          <p>Australia</p>
                        </div>
                        <div
                          onClick={() => {
                            setSearchedCityLat(40.4637);
                            setSearchedCityLong(-3.7492);
                            setSearchInput("Europe");
                            setIsViewingHome(false);
                          }}
                          className="flex flex-col space-y-2 group"
                        >
                          <img
                            className="aspect-square object-cover rounded-xl group-hover:outline outline-1"
                            src="/continent_images/europe.jpg"
                            alt=""
                          />
                          <p>Europe</p>
                        </div>
                        <div
                          onClick={() => {
                            setSearchedCityLat(-8.7832);
                            setSearchedCityLong(-55.4915);
                            setSearchInput("South America");
                            setIsViewingHome(false);
                          }}
                          className="flex flex-col space-y-2 group"
                        >
                          <img
                            className="aspect-square object-cover rounded-xl group-hover:outline outline-1"
                            src="/continent_images/south_america.jpg"
                            alt=""
                          />
                          <p>South America</p>
                        </div>
                        <div
                          onClick={() => {
                            setSearchedCityLat(37.0902);
                            setSearchedCityLong(-95.7129);
                            setSearchInput("United States");
                            setIsViewingHome(false);
                          }}
                          className="flex flex-col space-y-2 group"
                        >
                          <img
                            className="aspect-square object-cover rounded-xl group-hover:outline outline-1"
                            src="/continent_images/united_states.jpg"
                            alt=""
                          />
                          <p>United States</p>
                        </div>
                      </div>

                      <img src="/solutions.jpg" alt="" />
                    </div>
                  </Transition>
                </>
              )}
            </Popover>
          </SearchFormField>
        )}

        {/* <SearchFormField title="Desired Weather" icon={<RiSunFoggyLine className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />}>
					<SearchFieldDesiredWeather options={["clear", "rainy", "snow"]} />
				</SearchFormField> */}

        <div>
          <SearchFormField
            title="When"
            icon={
              <AiOutlineCalendar className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />
            }
          >
            <Popover className={`z-50`}>
              {({ open }) => (
                <>
                  <Popover.Button
                    onClick={() =>
                      !open
                        ? setIsMainBackdropOn(true)
                        : setIsMainBackdropOn(false)
                    }
                  >
                    <div className="flex items-center font-mono outline-none border-none">
                      <input
                        placeholder={`${format(startDate, "dd MMM")} - ${format(
                          endDate,
                          "dd MMM"
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
                    <Popover.Panel className="fixed top-0 left-0 sm:absolute sm:top-auto sm:left-auto bg-white border rounded shadow-black shadow-2xl">
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
                            onClick={() => setIsMainBackdropOn(false)}
                            className="bg-blue-500 text-white font-semibold p-3 rounded"
                          >
                            Done
                          </button>
                        </Popover.Overlay>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </SearchFormField>
        </div>
        <Popover className="relative flex items-center">
          {({ open }) => (
            <>
              <Popover.Button
                onClick={() =>
                  !open ? setIsMainBackdropOn(true) : setIsMainBackdropOn(false)
                }
              >
                <div
                  className={`text-gray-500 ${
                    open
                      ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  } text-2xl p-4 cursor-pointer`}
                >
                  {open ? <RiCloseLine /> : <RiSettingsLine />}
                </div>
              </Popover.Button>
              <Popover.Panel className="absolute z-10">
                <SettingsDropdown />
              </Popover.Panel>
            </>
          )}
        </Popover>

        <Tooltip
          label="Algorithm draws nearby cities with a population over 100,000"
          withArrow
        >
          <div
            className={`hidden sm:flex justify-center items-center text-white bg-[#445fc8] hover:bg-blue-400 h-8 w-8 rounded-full cursor-default transition transform ease-in-out`}
          >
            <p>i</p>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
export default SearchForm;
