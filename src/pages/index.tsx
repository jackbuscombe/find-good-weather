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
import ResultsTable from "../components/ResultsTable";
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

const Home: NextPage = () => {
  const userLat = useStore((state) => state.userLat);
  const userLong = useStore((state) => state.userLong);
  const selectedCityName = useStore((state) => state.selectedCityName);
  const setUserFullLocationName = useStore(
    (state) => state.setUserFullLocationName
  );
  const setUserCity = useStore((state) => state.setUserCity);
  const setUserCountry = useStore((state) => state.setUserCountry);
  const setUserPlaceId = useStore((state) => state.setUserPlaceId);
  const selectedCityLat = useStore((state) => state.selectedCityLat);
  const selectedCityLong = useStore((state) => state.selectedCityLong);
  const setSelectedCityLat = useStore((state) => state.setSelectedCityLat);
  const setSelectedCityLong = useStore((state) => state.setSelectedCityLong);

  const isLocationModalOpen = useStore((state) => state.isLocationModalOpen);
  const viewType = useStore((state) => state.viewType);
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
  // useOutsideAlerter(datepickerWrapperRef);
  const [pageNumber, setPageNumber] = useState(0);
  const [sortedResults, setSortedResults] = useState<typeof nearbyCities>([]);
  const resultsTableParent = useRef(null);

  const { data: userLocationObject, isLoading: isLoadingUserLocation } =
    trpc.useQuery(
      ["places.getCityFromLatLong", { lat: userLat, long: userLong }],
      {
        enabled: !!userLat && !!userLong,
        staleTime: Infinity,
        cacheTime: Infinity,
      }
    );

  const {
    data: nearbyCities,
    isLoading: isLoadingNearbyCities,
    refetch,
  } = trpc.useQuery(
    [
      "places.getNearbyCities",
      { isoCoords: coordinatesToISO(selectedCityLat, selectedCityLong) },
    ],
    {
      enabled: !!selectedCityLat && !!selectedCityLong,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
  const farPlaces = trpc.useQuery(["places.getFarPlaces"], {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // Set Selected Lat and Long to User Lat and Long On Load
  useEffect(() => {
    if (!userLat || !userLong) return;
    setSelectedCityLat(userLat);
    setSelectedCityLong(userLong);
  }, [userLat, userLong]);

  useEffect(() => {
    if (!nearbyCities) return;
    setPageNumber(0);
  }, [nearbyCities]);

  useEffect(() => {
    if (!userLocationObject) return;
    setUserPlaceId(userLocationObject.placeId);
    setUserCity(userLocationObject.cityName);
    setUserCountry(userLocationObject.countryName);
    setUserFullLocationName(userLocationObject.fullLocationName);
  }, [userLocationObject]);

  const [libraries] = useState<
    ("places" | "drawing" | "geometry" | "localContext" | "visualization")[]
  >(["places"]);
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

  useEffect(() => {
    resultsTableParent.current && autoAnimate(resultsTableParent.current);
  }, [resultsTableParent]);

  const SearchFormCallback = useCallback(() => {
    return <SearchForm refetch={refetch} className="-mt-24" />;
  }, [refetch]);

  // Animations
  const searchFormRef = useRef(null);
  useEffect(() => {
    searchFormRef.current && autoAnimate(searchFormRef.current);
  }, [searchFormRef]);

  const changePageButtonsRef = useRef(null);
  useEffect(() => {
    changePageButtonsRef.current && autoAnimate(changePageButtonsRef.current);
  }, [changePageButtonsRef]);

  return (
    <>
      <Head>
        <title>Find Good Weather</title>
        <meta name="description" content="Find good weather" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center py-12 bg-cover min-h-screen dark:bg-gray-900">
        {/* Form */}
        <div ref={searchFormRef}>{isLoaded && <SearchFormCallback />}</div>

        <div className="w-full flex justify-center" ref={changePageButtonsRef}>
          {nearbyCities && farPlaces.data && (
            <div className="w-5/6 xl:w-3/4 space-x-2 flex justify-center items-center mt-8">
              <PageChangeButton
                isNextPage={false}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                key="previous_button"
              />
              <PageChangeButton
                isNextPage={true}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                key="next_button"
              />
            </div>
          )}
        </div>

        {isLoaded &&
        nearbyCities &&
        farPlaces.data &&
        viewType === "vertical" ? (
          <div className="w-5/6 xl:w-3/4">
            <ResultsTable
              tableData={nearbyCities.concat(farPlaces.data)}
              pageNumber={pageNumber}
            />
          </div>
        ) : isLoadingNearbyCities ? (
          <div className="w-full flex justify-center items-center p-6">
            <Ring />
          </div>
        ) : null}

        {/* {isLocationModalOpen && selectedCityName && <LocationModal />} */}

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
      </main>
    </>
  );
};

export default Home;
