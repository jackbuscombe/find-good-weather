import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useState, useEffect, useRef, useMemo } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useStore } from "../components/appStore";
import SearchForm from "../components/SearchForm";
import Map from "../components/Map";
import coordinatesToISO from "../utils/coordinatesToISO";
import { Ring } from "@uiball/loaders";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import autoAnimate from "@formkit/auto-animate";
import PageChangeButton from "../components/UIComponents/PageChangeButton";
import { useCallback } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import SortBySelect from "../components/UIComponents/SortBySelect";
import CityResult from "../components/CityResult";
import LocationModal from "../components/LocationModal";
import { GeonameResult, WeatherApiWeatherObject } from "../types";

const Home: NextPage = () => {
  const isViewingHome = useStore((state) => state.isViewingHome);
  const userLat = useStore((state) => state.userLat);
  const userLong = useStore((state) => state.userLong);
  const selectedCityName = useStore((state) => state.selectedCityName);
  const setUserFullLocationName = useStore(
    (state) => state.setUserFullLocationName
  );
  const userCity = useStore((state) => state.userCity);
  const setUserCity = useStore((state) => state.setUserCity);
  const userCountry = useStore((state) => state.userCountry);
  const setUserCountry = useStore((state) => state.setUserCountry);
  const setUserPlaceId = useStore((state) => state.setUserPlaceId);
  const searchedCityLat = useStore((state) => state.searchedCityLat);
  const searchedCityLong = useStore((state) => state.searchedCityLong);
  const setSearchedCityLat = useStore((state) => state.setSearchedCityLat);
  const setSearchedCityLong = useStore((state) => state.setSearchedCityLong);
  const currentAirportIata = useStore((state) => state.currentAirportIata);
  const setCurrentAirportIata = useStore(
    (state) => state.setCurrentAirportIata
  );

  const isLocationModalOpen = useStore((state) => state.isLocationModalOpen);
  const setIsViewingHome = useStore((state) => state.setIsViewingHome);
  const viewType = useStore((state) => state.viewType);
  const maxDistanceKms = useStore((state) => state.maxDistanceKms);
  const [isDatepickerOpen, setIsDatepickerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult>();
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const datepickerWrapperRef = useRef(null);
  useOutsideAlerter(datepickerWrapperRef);
  const [pageNumber, setPageNumber] = useState(0);
  const [tableResultsWithGoodWeather, setTableResultsWithGoodWeather] =
    useState<GeonameResult[]>([]);

  // const { data: userLocationObject, isLoading: isLoadingUserLocation } =
  //   trpc.useQuery(
  //     ["places.getCityFromLatLong", { lat: userLat, long: userLong }],
  //     {
  //       enabled: !!userLat && !!userLong,
  //       staleTime: Infinity,
  //       cacheTime: Infinity,
  //     }
  //   );

  // const {
  //   data: nearbyCities,
  //   isLoading: isLoadingNearbyCities,
  //   refetch,
  // } = trpc.useQuery(
  //   [
  //     "places.getNearbyCities",
  //     { isoCoords: coordinatesToISO(selectedCityLat, selectedCityLong) },
  //   ],
  //   {
  //     enabled: !!selectedCityLat && !!selectedCityLong,
  //     staleTime: Infinity,
  //     cacheTime: Infinity,
  //   }
  // );

  const {
    data: nearbyCities,
    isLoading: isLoadingNearbyCities,
    refetch,
  } = trpc.useQuery(
    [
      "places.getNearbyPlacesMongo",
      { lat: searchedCityLat, lon: searchedCityLong, maxDistanceKms },
    ],
    {
      enabled: !!searchedCityLat && !!searchedCityLong && !!maxDistanceKms,
      staleTime: Infinity,
      cacheTime: Infinity,
      onSuccess: (cities) => {
        setTableResultsWithGoodWeather([
          userCityObject,
          ...tableResultsWithGoodWeather,
          ...cities,
        ]);
      },
    }
  );

  const { data: farPlaces } = trpc.useQuery(["places.getFarPlaces"], {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { data: currentAirport } = trpc.useQuery(
    ["flights.getIataCode", { lat: searchedCityLat, lon: searchedCityLong }],
    {
      enabled: !!searchedCityLat && !!searchedCityLong,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  // Set Selected Lat and Long to User Lat and Long On Load
  useMemo(() => {
    if (!userLat || !userLong) return;
    setSearchedCityLat(userLat);
    setSearchedCityLong(userLong);
  }, [userLat, userLong]);

  // useEffect(() => {
  //   if (!searchedCityLat || !searchedCityLong) return;
  //   setIsViewingHome(false);
  // }, [searchedCityLat, searchedCityLong]);

  useEffect(() => {
    if (!currentAirport) return;
    setCurrentAirportIata(currentAirport);
  }, [currentAirport]);

  useEffect(() => {
    if (!nearbyCities) return;
    setPageNumber(0);
  }, [nearbyCities]);

  // useMemo(() => {
  //   if (!userLocationObject) return;
  //   setUserPlaceId(userLocationObject.placeId);
  //   setUserCity(userLocationObject.cityName);
  //   setUserCountry(userLocationObject.countryName);
  //   setUserFullLocationName(userLocationObject.fullLocationName);
  // }, [userLocationObject]);

  // Google Maps and autocomplete necessities
  const [libraries] = useState<
    ("places" | "drawing" | "geometry" | "localContext" | "visualization")[]
  >(["places"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
    libraries,
  });

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const userCityObject: GeonameResult = {
    id: "0",
    name: userCity,
    countryName: userCountry,
    isFarPlace: false,
    distance: 0,
    lat: userLat,
    lon: userLong,
    isHome: true,
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
    if (destinationRef.current === null || destinationRef.current.value === "")
      return;
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: destinationRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    if (
      !results.routes[0] ||
      !results.routes[0]?.legs[0] ||
      !results.routes[0]?.legs[0]?.distance ||
      !results.routes[0]?.legs[0]?.duration
    )
      return;
    setDirectionsResponse(results);
    setDistance(results.routes[0]?.legs[0]?.distance?.text);
    setDuration(results.routes[0]?.legs[0]?.duration?.text);
  };

  const SearchFormCallback = useCallback(() => {
    return <SearchForm refetch={refetch} className="-mt-24" />;
  }, [refetch]);

  // Animations
  const searchFormRef = useRef(null);
  useEffect(() => {
    searchFormRef.current && autoAnimate(searchFormRef.current);
  }, [searchFormRef]);

  // Animations
  const changePageButtonsRef = useRef(null);
  useEffect(() => {
    changePageButtonsRef.current && autoAnimate(changePageButtonsRef.current);
  }, [changePageButtonsRef]);

  const sortedTableDataMemoized = useMemo(() => {
    if (!nearbyCities || !farPlaces) return;
    return [userCityObject, ...nearbyCities, ...farPlaces].sort(
      (a, b) => a.distance - b.distance
    );
  }, [nearbyCities]);

  // Animations
  const tableRef = useRef(null);
  useEffect(() => {
    tableRef.current && autoAnimate(tableRef.current);
  }, [tableRef]);

  //   Animations
  const resultsListRef = useRef(null);
  useEffect(() => {
    resultsListRef.current && autoAnimate(resultsListRef.current);
  }, [tableRef]);

  const addCity = <T,>(id: string) => {
    setTableResultsWithGoodWeather((current) =>
      current.filter((object) => object.id !== id)
    );
  };

  const removeCity = <T,>(id: string) => {
    setTableResultsWithGoodWeather((current) =>
      current.filter((object) => object.id !== id)
    );
  };

  return (
    <>
      <Head>
        <title>Find Good Weather</title>
        <meta name="description" content="GoodWeather.ai" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center py-12 bg-cover min-h-screen dark:bg-gray-900">
        {/* Form */}
        <div ref={searchFormRef}>{isLoaded && <SearchFormCallback />}</div>

        {nearbyCities && farPlaces && (
          <div className="w-11/12 xl:w-3/4 flex flex-col md:flex-row justify-between items-center mt-3 font-mono space-x-6 text-lg my-4">
            <div className="hidden md:flex items-center">
              <p className="text-gray-500 mr-3">Searching Results: </p>
              <span className="text-black dark:text-white font-bold">
                {nearbyCities.concat(farPlaces).length}
              </span>
            </div>
            <div className="flex items-center self-end">
              <p className="hidden sm:flex text-gray-500 mr-3">Sort by: </p>
              <SortBySelect />
            </div>
          </div>
        )}

        <div className="w-full flex justify-center" ref={changePageButtonsRef}>
          {nearbyCities && farPlaces && (
            <div className="w-11/12 xl:w-3/4 space-x-2 flex justify-center items-center mt-4">
              <PageChangeButton
                isNextPage={false}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                key="previous_button"
                maxPageNumber={tableResultsWithGoodWeather.length}
              />
              <PageChangeButton
                isNextPage={true}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                key="next_button"
                maxPageNumber={tableResultsWithGoodWeather.length}
              />
            </div>
          )}
        </div>

        {isLoaded && nearbyCities && farPlaces && viewType === "vertical" ? (
          <div className="w-11/12 xl:w-3/4">
            <div ref={tableRef}>
              <div
                className="grid grid-cols-1 grid-rows-1 overflow-hidden lg:grid-cols-5 gap-2"
                ref={resultsListRef}
              >
                {tableResultsWithGoodWeather
                  .slice(pageNumber, pageNumber + 5)
                  .map(
                    (
                      {
                        id,
                        name,
                        countryName,
                        lat,
                        lon,
                        distance,
                        isFarPlace,
                        isHome,
                      },
                      i
                    ) => (
                      <CityResult
                        key={id}
                        id={id}
                        name={name}
                        countryName={countryName}
                        lat={lat}
                        lon={lon}
                        distance={distance}
                        isHome={isHome}
                        isFarPlace={isFarPlace}
                        addCity={addCity}
                        removeCity={removeCity}
                      />
                    )
                  )}
              </div>
            </div>
          </div>
        ) : isLoadingNearbyCities ? (
          <div className="w-full flex justify-center items-center p-6">
            <Ring />
          </div>
        ) : null}

        {/* {isLocationModalOpen && selectedCityName && <LocationModalOld />} */}

        {/* {isLoaded && viewType === "map" && (
					<div className="w-screen h-screen">
						<Map />
					</div>
				)} */}

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
        <LocationModal />
      </main>
    </>
  );
};

export default Home;
