import {
  RiUserLocationLine,
  RiPlaneLine,
  RiTrainFill,
  RiCarFill,
  RiPlaneFill,
  RiUserLocationFill,
  RiCarLine,
  RiTrainLine,
} from "react-icons/ri";
import { trpc } from "../utils/trpc";
import WeatherCell from "./WeatherCell";
import WeatherCellNew from "./WeatherCellNew";
import { useEffect, useMemo, useState, memo, useRef } from "react";
import axios from "axios";
import { useStore } from "./appStore";
import { Ring } from "@uiball/loaders";
import {
  GeonameResult,
  WeatherApiWeatherObject,
  WeatherObject,
} from "../types";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import {
  BiBadgeCheck,
  BiChevronsDown,
  BiChevronsUp,
  BiCurrentLocation,
} from "react-icons/bi";
import autoAnimate from "@formkit/auto-animate";
import milesToKm from "../utils/milesToKm";
import { FaPlaneDeparture } from "react-icons/fa";
import { add, format } from "date-fns";
import { getWeatherDescriptionFromCode } from "../utils/getWeatherDescriptionFromCode";
import secondsToDhm from "../utils/secondsToDhm";

type Props = {
  name: string;
  countryName: string;
  distance: number;
  lat: number;
  lon: number;
  isHome?: boolean;
  id: string;
  isFarPlace?: boolean;
  addCity: <T>(id: string) => void;
  removeCity: <T>(id: string) => void;
};

function CityResultVertical({
  id,
  name,
  countryName,
  lat,
  lon,
  distance,
  isHome = false,
  isFarPlace = false,
  addCity,
  removeCity,
}: Props) {
  const [isExtended, setIsExtended] = useState(false);
  const [wikidataId, setWikidataId] = useState<string>();
  const [distanceFromUser, setDistanceFromUser] = useState("");
  const [flightTime, setFlightTime] = useState("");
  const [transportTime, setTransportTime] = useState("");
  // const [driveTime, setDriveTime] = useState("");
  const [fetchedCountryName, setFetchedCountryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  // const [mainImageUrl, setMainImageUrl] = useState("");
  const [timezone, setTimezone] = useState("");
  const [locationId, setLocationId] = useState("");
  const [accommodationCount, setAccommodationCount] = useState("");
  const [airportCount, setAirportCount] = useState("");
  const [attractionsCount, setAttractionsCount] = useState("");
  const [neighborhoodCount, setNeighborhoodCount] = useState("");
  const [restaurantCount, setRestaurantCount] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [forecast, setForecast] = useState<WeatherObject[]>();
  const setSelectedCityGeonameId = useStore(
    (state) => state.setSelectedCityGeonameId
  );
  const celsius = useStore((state) => state.celsius);
  const userCity = useStore((state) => state.userCity);
  const userCurrency = useStore((state) => state.userCurrency);
  const userLat = useStore((state) => state.userLat);
  const userLong = useStore((state) => state.userLong);
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
  const setSelectedCityFlightLink = useStore(
    (state) => state.setSelectedCityFlightLink
  );
  const isLocationModalOpen = useStore((state) => state.isLocationModalOpen);
  const setIsLocationModalOpen = useStore(
    (state) => state.setIsLocationModalOpen
  );
  const selectedCityFlightTime = useStore(
    (state) => state.selectedCityFlightTime
  );
  const selectedCityTransitTime = useStore(
    (state) => state.selectedCityTransitTime
  );
  const selectedCityDriveTime = useStore(
    (state) => state.selectedCityDriveTime
  );
  const setSelectedCityFlightTime = useStore(
    (state) => state.setSelectedCityFlightTime
  );
  const setSelectedCityTransitTime = useStore(
    (state) => state.setSelectedCityTransitTime
  );
  const setSelectedCityDriveTime = useStore(
    (state) => state.setSelectedCityDriveTime
  );
  const selectedCityLat = useStore((state) => state.selectedCityLat);
  const setSelectedCityLat = useStore((state) => state.setSelectedCityLat);
  const selectedCityLong = useStore((state) => state.selectedCityLong);
  const setSelectedCityLong = useStore((state) => state.setSelectedCityLong);
  const selectedAirportIata = useStore((state) => state.selectedAirportIata);
  const setSelectedAirportIata = useStore(
    (state) => state.setSelectedAirportIata
  );
  const [hiddenResult, setHiddenResult] = useState(false);
  const isViewingHome = useStore((state) => state.isViewingHome);
  const [flightLink, setFlightLink] = useState("");
  const currentAirportIata = useStore((state) => state.currentAirportIata);
  const startDate = useStore((state) => state.startDate);
  const endDate = useStore((state) => state.endDate);
  const [isFutureForecast, setIsFutureForecast] = useState(false);
  const [futureDates, setFutureDates] = useState<Date[]>([]);

  useMemo(() => {
    if (startDate > add(new Date(), { days: 13 })) {
      setIsFutureForecast(true);
    }
    if (startDate < add(new Date(), { days: 14 })) {
      setIsFutureForecast(false);
    }
  }, [startDate]);

  const { data: homePhotoUrl, isLoading: isLoadingHomePhoto } = trpc.useQuery(
    [
      "places.getWikiMediaImageNewest",
      { lat: lat.toString(), lon: lon.toString() },
    ],
    {
      enabled: !!lat && !!lon && isHome,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const { data: mainPhotoUrl, isLoading: isLoadingMainPhoto } = trpc.useQuery(
    ["places.getWikiMediaFromGeonamesId", { geoNamesId: parseInt(id) }],
    {
      enabled: !!id && !isHome,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const { data: weather, isLoading: isLoadingWeather } = trpc.useQuery(
    ["forecast.getWeatherApiForecastByLatLong", { lat, lon, days: 10, isHome }],
    {
      enabled: !!lat && !!lon && isHome != undefined,
      staleTime: Infinity,
      cacheTime: Infinity,
      onSuccess: (returnedWeather) => {
        if (!returnedWeather) {
          // addCity(id);
          removeCity(id);
        }
      },
    }
  );

  // const { data: cityForecastFuture, isLoading: isLoadingFutureForecast } =
  //   trpc.useQuery(
  //     [
  //       "forecast.getWeatherApiFutureByLatLongDate",
  //       {
  //         startDate: startDate,
  //         endDate: endDate,
  //         lat,
  //         lon,
  //       },
  //     ],
  //     {
  //       enabled: startDate > add(new Date(), { days: 13 }),
  //       cacheTime: Infinity,
  //       staleTime: Infinity,
  //     }
  //   );

  const { data: airportIata } = trpc.useQuery(
    [
      "flights.getIataCode",
      {
        lat,
        lon,
      },
    ],
    {
      enabled: !!lon && !!lat,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  useMemo(() => {
    if (!currentAirportIata || !airportIata || !startDate) return;
    setFlightLink(
      `https://wayaway.io/?segments[0][origin_iata]=${currentAirportIata}&segments[0][destination_iata]=${airportIata}&segments[0][depart_date]=${format(
        startDate,
        "yyyy-MM-dd"
      )}${
        endDate &&
        `&segments[1][origin_iata]=${airportIata}&segments[1][destination_iata]=${currentAirportIata}&segments[1][depart_date]=${format(
          endDate,
          "yyyy-MM-dd"
        )}`
      }&adults=1&children=0&infants=0&trip_class=0&with_request=true&marker=408160`
    );
  }, [currentAirportIata, airportIata, startDate, endDate]);

  const { data: driveTime, isLoading: isLoadingDriveTime } = trpc.useQuery(
    [
      "places.getDriveTimeFromLatLong",
      {
        userLat,
        userLong,
        destinationLat: lat,
        destinationLong: lon,
      },
    ],
    {
      enabled: !!userLat && !!userLong && !!lat && !!lon,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const { data: transitTime, isLoading: isLoadingTransitTime } = trpc.useQuery(
    [
      "places.getTransitTimeFromLatLong",
      {
        userLat,
        userLong,
        destinationLat: lat,
        destinationLong: lon,
      },
    ],
    {
      enabled: !!userLat && !!userLong && !!lat && !!lon,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const { data: flights, isLoading: isLoadingFlights } = trpc.useQuery(
    [
      "flights.getFlights",
      {
        originIata: currentAirportIata,
        destinationIata: airportIata ?? "",
        currency: userCurrency,
        isOneWay: true,
        departureDate: format(add(startDate, { days: 2 }), "yyyy-MM-dd"),
        returnData: format(add(startDate, { days: 6 }), "yyyy-MM-dd"),
      },
    ],
    {
      enabled:
        !!currentAirportIata && !!airportIata && !!userCurrency && !!startDate,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  // useEffect(() => {
  //   if (!travelTime) return;
  //   console.log("Travel time", travelTime);
  //   if (travelTime?.rows?.[0]?.elements?.[0]?.status != "ZERO_RESULTS") {
  //     setFlightTime(travelTime?.rows?.[0]?.elements?.[0]?.duration?.text);
  //     setTransportTime(travelTime?.rows[0]?.elements?.[0]?.duration?.text);
  //     setDriveTime(travelTime?.rows?.[0]?.elements?.[0]?.duration?.text);
  //     setDistanceFromUser(travelTime?.rows?.[0]?.elements?.[0]?.distance?.text);
  //   }
  // }, [travelTime]);

  // useEffect(() => {
  //   if (!locationDetails) return;
  //   setFetchedCountryName(locationDetails);
  // }, [locationDetails]);

  //   Animations
  const resultRef = useRef(null);
  useEffect(() => {
    resultRef.current && autoAnimate(resultRef.current);
  }, [resultRef]);

  //   Animations
  const weatherCellsRef = useRef(null);
  useEffect(() => {
    weatherCellsRef.current && autoAnimate(weatherCellsRef.current);
  }, [weatherCellsRef]);

  return (
    <div
      onClick={() => {
        setSelectedCityGeonameId(id);
        setSelectedCityName(name);
        setSelectedCountryName(countryName);
        setSelectedCityLat(lat);
        setSelectedCityLong(lon);
        setSelectedCityWeatherData(weather ?? []);
        setSelectedCityDriveTime(driveTime ?? "N/A");
        setSelectedCityTransitTime(transitTime ?? "N/A");
        setSelectedCityFlightTime(
          flights && flights.length > 0
            ? secondsToDhm(flights[0] ? flights[0]?.duration * 60 : 0)
            : "N/A"
        );
        setSelectedCityFlightLink(flightLink);
        setSelectedAirportIata(airportIata ?? "");
        setIsLocationModalOpen(true);
      }}
      // className={`${!weather && "hidden"}`}
      ref={resultRef}
    >
      {isLoadingWeather ? (
        <div className="flex justify-center mt-8 text-white">
          <Ring color="white" />
        </div>
      ) : weather ? (
        <div
          key={name}
          className={`grid grid-rows-7 p-4 rounded border shadow transition transform ease-in-out bg-white font-mono cursor-pointer ${
            isHome && "!bg-blue-50 hover:bg-blue-200"
          } ${!isHome && "hover:bg-gray-50"}`}
        >
          {/* Row 1 */}
          <div className="flex justify-center items-center h-28 w-full shadow overflow-hidden rounded-xl mb-4">
            {(isHome ? isLoadingHomePhoto : isLoadingMainPhoto) ? (
              <Ring />
            ) : (
              <img
                src={
                  (isHome ? homePhotoUrl : mainPhotoUrl) ||
                  "/no-image-placeholder.jpg"
                }
                alt={name}
                className=""
              />
            )}
          </div>

          {/* Row 2 */}
          <div className="">
            <h2 className="text-2xl font-extrabold">{name}</h2>
            <h3 className="text-gray-500">{countryName}</h3>
          </div>

          {/* Row 3 */}
          <div className="flex items-center h-36">
            {isHome ? (
              <div className="flex items-center space-x-4 font-semibold text-blue-500 my-4 text-xl font-sans">
                <RiUserLocationLine
                  size={40}
                  className="border-4 border-blue-500 p-1 rounded-full"
                />
                <p>
                  You are
                  <br />
                  here now
                </p>
              </div>
            ) : (
              <div className="text-xl font-semibold">
                {/* {isFarPlace ? (
                <div className="bg-yellow-500 p-2 rounded-full flex justify-center items-center font-semibold space-x-2 text-gray-900 mb-3">
                  <BiBadgeCheck />
                  <p>Popular!</p>
                </div>
              ) : (
                <div className="bg-blue-500 p-2 rounded-full flex justify-center items-center font-semibold space-x-2 text-gray-100 mb-3">
                  <BiCurrentLocation />
                  <p>Near you</p>
                </div>
              )} */}
                <a
                  href={flightLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center space-x-4 my-2 hover:text-blue-500 group hover:underline"
                >
                  <RiPlaneLine size={26} />
                  <p className="text-gray-500 group-hover:text-blue-500">
                    {isLoadingFlights ? (
                      <div className="w-full text-gray-500">
                        <Ring size={16} />
                      </div>
                    ) : flights && flights.length > 0 ? (
                      secondsToDhm((flights[0]?.duration ?? 0) * 60) ?? "N/A"
                    ) : (
                      <p className="text-gray-500 group-hover:text-blue-500">
                        No flight routes
                      </p>
                    )}
                  </p>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLong}&destination=${lat},${lon}&travelmode=transit`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center space-x-4 my-2 hover:text-blue-500 group hover:underline"
                >
                  <RiTrainLine size={26} />
                  {isLoadingTransitTime ? (
                    <div className="w-full text-gray-500">
                      <Ring size={16} />
                    </div>
                  ) : transitTime ? (
                    <p className="text-gray-500 group-hover:text-blue-500">
                      {transitTime}
                    </p>
                  ) : null}
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLong}&destination=${lat},${lon}&travelmode=driving`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center space-x-4 my-2 hover:text-blue-500 group hover:underline"
                >
                  <RiCarLine size={26} />
                  {isLoadingDriveTime ? (
                    <div className="w-full text-gray-500">
                      <Ring size={16} />
                    </div>
                  ) : driveTime ? (
                    <p className="text-gray-500 group-hover:text-blue-500">
                      {driveTime}
                    </p>
                  ) : null}
                </a>
              </div>
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex sm:hidden justify-center items-center text-sm border ${
              expanded
                ? "bg-blue-100 text-blue-500 hover:bg-blue-200 transition ease-in-out"
                : "bg-blue-500 text-white hover:bg-blue-600 transition ease-in-out"
            } font-bold p-4 rounded-4 rounded`}
          >
            {expanded ? (
              <BsChevronUp className="mr-2" />
            ) : (
              <BsChevronDown className="mr-2" />
            )}
            {expanded ? "Collapse" : "Expand"}
            {expanded ? (
              <BsChevronUp className="ml-2" />
            ) : (
              <BsChevronDown className="ml-2" />
            )}
          </button>

          {weather ? (
            <div
              className={`${
                expanded ? "row-span-1" : "hidden"
              } sm:row-span-1 sm:flex sm:flex-col`}
              ref={weatherCellsRef}
            >
              {weather.map(
                (
                  {
                    date,
                    temp_c,
                    temp_max_c,
                    temp_min_c,
                    condition,
                    conditionCode,
                  },
                  i
                ) => (
                  <WeatherCellNew
                    key={i}
                    date={date}
                    avg={temp_c}
                    low={temp_min_c}
                    high={temp_max_c}
                    text={condition}
                    conditionCode={conditionCode}
                    isCurrentDay={i == 0 ? true : false}
                  />
                )
              )}

              {/* {isFutureForecast && cityForecastFuture?.forecastArray ? (
              cityForecastFuture.forecastArray.map(
                (
                  {
                    date,
                    temp_c,
                    temp_max_c,
                    temp_min_c,
                    condition,
                    conditionCode,
                  },
                  i
                ) => (
                  <WeatherCellNew
                    key={i}
                    date={date}
                    avg={temp_c}
                    low={temp_min_c}
                    high={temp_max_c}
                    text={condition}
                    conditionCode={conditionCode}
                    isCurrentDay={i == 0 ? true : false}
                  />
                )
              )
            ) : (
              weather.map(
                (
                  {
                    date,
                    temp_c,
                    temp_max_c,
                    temp_min_c,
                    condition,
                    conditionCode,
                  },
                  i
                ) => (
                  <WeatherCellNew
                    key={i}
                    date={date}
                    avg={temp_c}
                    low={temp_min_c}
                    high={temp_max_c}
                    text={condition}
                    conditionCode={conditionCode}
                    isCurrentDay={i == 0 ? true : false}
                  />
                )
              )
            )} */}
              {/* {cityForecast
                .slice(0, 6)
                .map(({ day, date, low, high, text }, i) => (
                  <WeatherCell
                    key={i}
                    day={day}
                    date={date}
                    low={low}
                    high={high}
                    text={text}
                  />
                ))}
              {isExtended &&
                cityForecast
                  .slice(6, 11)
                  .map(({ day, date, low, high, text }, i) => (
                    <WeatherCell
                      key={i}
                      day={day}
                      date={date}
                      low={low}
                      high={high}
                      text={text}
                    />
                  ))} */}
              {/* <button
              className="flex justify-center items-center space-x-3 bg-blue-500 rounded-full text-white font-semibold p-2"
              onClick={() => setIsExtended(!isExtended)}
            >
              {!isExtended ? <BiChevronsDown /> : <BiChevronsUp />}{" "}
              {`${!isExtended ? "Show More" : "Show Less"}`}{" "}
              {!isExtended ? <BiChevronsDown /> : <BiChevronsUp />}
            </button> */}
            </div>
          ) : null}

          {/* Old Version with openweathermap */}
          {/* {isLoading ? <Ring /> : <div className="row-span-1">{forecast && forecast.map(({ temp, tempMin, tempMax, feelsLike, humidity, windSpeed, description, icon, timestamp }, i) => <WeatherCell key={i} temp={temp} tempMin={tempMin} tempMax={tempMax} feelsLike={feelsLike} humidity={humidity} windSpeed={windSpeed} description={description} icon={icon} timestamp={timestamp} />)}</div>} */}

          {/* <button
				onClick={() => {
					setSelectedCityName(name);
					setSelectedCountryName(fetchedCountryName);
					setSelectedCityLat(lat);
					setSelectedCityLong(lon);
					setSelectedCityDriveTime(driveTime);
					setSelectedCityWeatherData(forecast ?? []);
					setIsLocationModalOpen(true);
				}}
				className={`row-span-1 text-blue-500 font-bold shadow rounded h-12 ${isUserHere ? "bg-gray-100 hover:bg-gray-200" : "bg-blue-100 hover:bg-blue-200"}`}
			>
				BOOK
			</button> */}
        </div>
      ) : null}
    </div>
  );
}
export default memo(CityResultVertical);
