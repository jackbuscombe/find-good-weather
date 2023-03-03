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
import { WeatherObject } from "../types";
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

type Props = {
  name: string;
  countryName: string;
  distance: number;
  lat: number;
  lon: number;
  isUserHere?: boolean;
  id: string;
  isFarPlace?: boolean;
};

function CityResultVertical({
  id,
  name,
  countryName,
  lat,
  lon,
  distance,
  isUserHere = false,
  isFarPlace = false,
}: Props) {
  const [isExtended, setIsExtended] = useState(false);
  const [wikidataId, setWikidataId] = useState<string>();
  const [distanceFromUser, setDistanceFromUser] = useState("");
  const [flightTime, setFlightTime] = useState("");
  const [transportTime, setTransportTime] = useState("");
  const [driveTime, setDriveTime] = useState("");
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
  const celsius = useStore((state) => state.celsius);
  const userCity = useStore((state) => state.userCity);
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
  const isLocationModalOpen = useStore((state) => state.isLocationModalOpen);
  const setIsLocationModalOpen = useStore(
    (state) => state.setIsLocationModalOpen
  );
  const selectedCityFlightTime = useStore(
    (state) => state.selectedCityFlightTime
  );
  const selectedCityTransportTime = useStore(
    (state) => state.selectedCityTransportTime
  );
  const selectedCityDriveTime = useStore(
    (state) => state.selectedCityDriveTime
  );
  const setSelectedCityFlightTime = useStore(
    (state) => state.setSelectedCityFlightTime
  );
  const setSelectedCityTransportTime = useStore(
    (state) => state.setSelectedCityTransportTime
  );
  const setSelectedCityDriveTime = useStore(
    (state) => state.setSelectedCityDriveTime
  );
  const selectedCityLat = useStore((state) => state.selectedCityLat);
  const setSelectedCityLat = useStore((state) => state.setSelectedCityLat);
  const selectedCityLong = useStore((state) => state.selectedCityLong);
  const setSelectedCityLong = useStore((state) => state.setSelectedCityLong);
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

  // const { data: mainPhotoUrl, isLoading: isLoadingMainPhoto } = trpc.useQuery(
  //   ["places.getWikiMediaImage", { wikiDataId: id }],
  //   {
  //     enabled: !!id,
  //     staleTime: Infinity,
  //     cacheTime: Infinity,
  //   }
  // );

  // const { data: mainPhotoUrl, isLoading: isLoadingMainPhoto } = trpc.useQuery(
  //   [
  //     "places.getWikiMediaImageNewest",
  //     { lat: lat.toString(), lon: lon.toString() },
  //   ],
  //   {
  //     enabled: !!lat && !!lon,
  //     staleTime: Infinity,
  //     cacheTime: Infinity,
  //   }
  // );

  const { data: mainPhotoUrl, isLoading: isLoadingMainPhoto } = trpc.useQuery(
    ["places.getWikiMediaFromGeonamesId", { geoNamesId: parseInt(id) }],
    {
      enabled: !!id,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  useEffect(() => {
    if (!mainPhotoUrl) return;
    console.log("SPARQL ", mainPhotoUrl);
  }, [mainPhotoUrl]);

  const { data: travelTime } = trpc.useQuery(
    [
      "places.getTravelTimeFromCityName",
      {
        destinationCityName: `${name} ${countryName}`,
        originCityName: `${userCity}`,
      },
    ],
    {
      enabled: !!name && !!countryName && !!userCity,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  // const { data: locationForecast, isLoading } = trpc.useQuery(["forecast.getForecast", { lat, lon }], {
  // 	enabled: !!lat && !!lon,
  // 	staleTime: Infinity,
  // 	cacheTime: Infinity,
  // });

  const { data: locationDetails } = trpc.useQuery(
    ["places.getPlaceDetailsFromCityName", { selectedCityName: name }],
    {
      enabled: !!name,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  // Currently Functional
  //   const { data: cityDetails } = trpc.useQuery(
  //     ["places.getPlaceDetailsFromCityId", { id }],
  //     {
  //       enabled: !!userCity,
  //       staleTime: Infinity,
  //       cacheTime: Infinity,
  //     }
  //   );

  // Currently Functional - Yahoo Forecast
  // const { data: cityForecastOld, isLoading: isLoadingCityForecast } =
  //   trpc.useQuery(
  //     ["forecast.getYahooForecastByLatLong", { lat, lon }],
  //     {
  //       enabled: !!lat && !!lon,
  //       staleTime: Infinity,
  //       cacheTime: Infinity,
  //     }
  //   );

  const { data: cityForecast } = trpc.useQuery(
    ["forecast.getWeatherApiForecastByLatLong", { lat, lon, days: 10 }],
    {
      enabled: !!lat && !!lon,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const { data: cityForecastFuture, isLoading: isLoadingFutureForecast } =
    trpc.useQuery(
      [
        "forecast.getWeatherApiFutureByLatLongDate",
        {
          startDate: startDate,
          endDate: endDate,
          lat,
          lon,
        },
      ],
      {
        enabled: startDate > add(new Date(), { days: 13 }),
        cacheTime: Infinity,
        staleTime: Infinity,
      }
    );

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
    console.log("Current Airport: "), currentAirportIata;
    console.log("StartData: ", startDate);
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

  // Update Forecast with startDate and endDate
  useMemo(() => {
    if (startDate < new Date()) return;

    if (startDate > add(new Date(), { days: 7 })) {
      console.log("The start date is more than 7 days in the furture");
    }

    if (endDate > add(new Date(), { days: 7 })) {
      console.log("The end date is more than 7 days in the furture");
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!cityForecast) return;
    console.log("This is the new cityCorecast", cityForecast);
  }, [cityForecast]);

  useEffect(() => {
    if (!travelTime) return;
    console.log("Travel time", travelTime);
    if (travelTime?.rows?.[0]?.elements?.[0]?.status != "ZERO_RESULTS") {
      setFlightTime(travelTime?.rows?.[0]?.elements?.[0]?.duration?.text);
      setTransportTime(travelTime?.rows[0]?.elements?.[0]?.duration?.text);
      setDriveTime(travelTime?.rows?.[0]?.elements?.[0]?.duration?.text);
      setDistanceFromUser(travelTime?.rows?.[0]?.elements?.[0]?.distance?.text);
    }
  }, [travelTime]);

  useEffect(() => {
    if (!locationDetails) return;
    setFetchedCountryName(locationDetails);
  }, [locationDetails]);

  const weatherScore = useMemo(() => {
    if (!cityForecast) return;

    const goodWeather =
      "clear" &&
      "sun" &&
      "sunny" &&
      "mostly sunny" &&
      "mostly clear" &&
      "partly cloudy" &&
      "fog";
    const badWeather =
      "rain" &&
      "rainy" &&
      "scattered showers" &&
      "showers" &&
      "rain and snow" &&
      "storms" &&
      "storm" &&
      "thunder" &&
      "thunderstorms" &&
      "lightning" &&
      "hail" &&
      "hail storm" &&
      "hailing" &&
      "snow storm" &&
      "patchy rain possible" &&
      "moderate rain" &&
      "heavy rain" &&
      "patchy rain nearby" &&
      "moderate or heavy rain shower" &&
      "moderate or heavy snow showers" &&
      "moderate rain at times" &&
      "heavy rain at times";

    let pointTally = 0;
    let count = 0;

    // Do filter process
    for (let i = 0; i < cityForecast.forecast.length; i++) {
      if (
        (getWeatherDescriptionFromCode as { [index: number]: string })[
          cityForecast.forecast[i]?.condition as number
        ] == goodWeather
      ) {
        pointTally++;
      } else if (
        (getWeatherDescriptionFromCode as { [index: number]: string })[
          cityForecast.forecast[i]?.condition as number
        ] == badWeather
      ) {
        pointTally--;
      }
      count++;
    }
    if (pointTally / count < -0.6) {
      setHiddenResult(true);
    }
    return pointTally / count;
  }, [cityForecast]);

  useEffect(() => {
    if (!weatherScore) return;
    console.log("Weatherscore: ", name + weatherScore);
  }, [weatherScore]);

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
      onClick={() => setIsLocationModalOpen(true)}
      className={`${hiddenResult && "hidden"}`}
      ref={resultRef}
    >
      <div
        key={name}
        className={`grid grid-rows-7 p-4 rounded border shadow transition transform ease-in-out bg-white font-mono cursor-pointer ${
          isUserHere && "!bg-blue-50 hover:bg-blue-200"
        } ${!isUserHere && "hover:bg-gray-50"}`}
      >
        {/* Row 1 */}
        <div className="flex justify-center items-center h-28 w-full shadow overflow-hidden rounded-xl mb-4">
          {isLoadingMainPhoto ? (
            <Ring />
          ) : (
            <img
              src={mainPhotoUrl || "/no-image-placeholder.jpg"}
              alt={name}
              className=""
            />
          )}
        </div>

        {/* Row 2 */}
        <div className="">
          {/* <h2 className="text-2xl font-extrabold">{cityForecast?.cityName}</h2>
          <h3 className="text-gray-500">{cityForecast?.countryName}</h3> */}
          <h2 className="text-2xl font-extrabold">{name}</h2>
          <h3 className="text-gray-500">{countryName}</h3>
        </div>

        {/* Row 3 */}
        <div className="flex items-center h-36">
          {isUserHere ? (
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
                className="w-full flex justify-center items-center space-x-4 my-2 hover:text-blue-500 group hover:underline"
              >
                <RiPlaneLine size={26} />
                <p className="text-gray-500 group-hover:text-blue-500">
                  {flightTime ?? "N/A"}
                </p>
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLong}&destination=${lat},${lon}&travelmode=transit`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex justify-center items-center space-x-4 my-2 hover:text-blue-500 group hover:underline"
              >
                <RiTrainLine size={26} />
                <p className="text-gray-500">{transportTime ?? "N/A"}</p>
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLong}&destination=${lat},${lon}&travelmode=driving`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex justify-center items-center space-x-4 my-2 hover:text-blue-500 group hover:underline"
              >
                <RiCarLine size={26} />
                <p className="text-gray-500">{driveTime ?? "N/A"}</p>
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

        {cityForecast?.forecast ? (
          <div
            className={`${
              expanded ? "row-span-1" : "hidden"
            } sm:row-span-1 sm:flex sm:flex-col`}
            ref={weatherCellsRef}
          >
            {isFutureForecast && cityForecastFuture?.forecastArray ? (
              cityForecastFuture.forecastArray.map(
                ({ date, temp_c, temp_max_c, temp_min_c, condition }, i) => (
                  <WeatherCellNew
                    key={i}
                    date={date}
                    avg={temp_c}
                    low={temp_min_c}
                    high={temp_max_c}
                    text={condition}
                    isCurrentDay={i == 0 ? true : false}
                  />
                )
              )
            ) : isFutureForecast && isLoadingFutureForecast ? (
              <div className="w-full flex justify-center items-center">
                <Ring />
              </div>
            ) : (
              cityForecast?.forecast.map(
                ({ date, temp_c, temp_max_c, temp_min_c, condition }, i) => (
                  <WeatherCellNew
                    key={i}
                    date={date}
                    avg={temp_c}
                    low={temp_min_c}
                    high={temp_max_c}
                    text={condition}
                    isCurrentDay={i == 0 ? true : false}
                  />
                )
              )
            )}
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
    </div>
  );
}
export default memo(CityResultVertical);
