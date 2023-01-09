import {
  RiUserLocationLine,
  RiPlaneLine,
  RiTrainFill,
  RiCarFill,
} from "react-icons/ri";
import { trpc } from "../utils/trpc";
import WeatherCell from "./WeatherCell";
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

type Props = {
  cityName: string;
  countryName: string;
  distance: number;
  longitude: number;
  latitude: number;
  isUserHere?: boolean;
  cityId: string;
  isFarPlace?: boolean;
};

function CityResultVertical({
  cityId,
  latitude,
  longitude,
  cityName,
  countryName,
  distance,
  isUserHere = false,
  isFarPlace = false,
}: Props) {
  const [isExtended, setIsExtended] = useState(false);
  const [distanceFromUser, setDistanceFromUser] = useState("");
  const [flightTime, setFlightTime] = useState("");
  const [transportTime, setTransportTime] = useState("");
  const [driveTime, setDriveTime] = useState("");
  const [fetchedCountryName, setFetchedCountryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [timezone, setTimezone] = useState("");
  const [locationId, setLocationId] = useState("");
  const [accommodationCount, setAccommodationCount] = useState("");
  const [airportCount, setAirportCount] = useState("");
  const [attractionsCount, setAttractionsCount] = useState("");
  const [neighborhoodCount, setNeighborhoodCount] = useState("");
  const [restaurantCount, setRestaurantCount] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [forecast, setForecast] = useState<WeatherObject[]>();
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

  const { data: cityBasicDetails, isLoading: isLoadingCityBasicDetails } =
    trpc.useQuery(["places.getPlaceBasicDetailsFromCityName", { cityName }], {
      enabled: !!userCity,
      staleTime: Infinity,
      cacheTime: Infinity,
    });
  // const cityBasicDetailsMemoized = useMemo(() => {

  // }, [])

  const { data: travelTime } = trpc.useQuery(
    [
      "places.getTravelTimeFromCityName",
      {
        destinationCityName: `${cityName} ${countryName}`,
        originCityName: `${userCity}`,
      },
    ],
    {
      enabled: !!cityName && !!countryName && !!userCity,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  // const { data: locationForecast, isLoading } = trpc.useQuery(["forecast.getForecast", { latitude, longitude }], {
  // 	enabled: !!latitude && !!longitude,
  // 	staleTime: Infinity,
  // 	cacheTime: Infinity,
  // });

  const { data: locationDetails } = trpc.useQuery(
    ["places.getPlaceDetailsFromCityName", { selectedCityName: cityName }],
    {
      enabled: !!cityName,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  // Currently Functional
  //   const { data: cityDetails } = trpc.useQuery(
  //     ["places.getPlaceDetailsFromCityId", { cityId }],
  //     {
  //       enabled: !!userCity,
  //       staleTime: Infinity,
  //       cacheTime: Infinity,
  //     }
  //   );

  // Currently Functional - Yahoo Forecast
  const { data: cityForecast, isLoading: isLoadingCityForecast } =
    trpc.useQuery(
      ["forecast.getYahooForecastByLatLong", { latitude, longitude }],
      {
        enabled: !!latitude && !!longitude,
        staleTime: Infinity,
        cacheTime: Infinity,
      }
    );

  useEffect(() => {
    if (!cityForecast) return;
    console.log(cityForecast);
  });

  useEffect(() => {
    if (!cityBasicDetails) return;
    setMainImageUrl(cityBasicDetails.mainPhotoUrl);
  }, [cityBasicDetails]);

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

  // useEffect(() => {
  // 	if (!locationForecast) return;
  // 	console.log("This is the location forecast", locationForecast);
  // 	const forecastArray = [];
  // 	for (let i = 0; i < locationForecast.list.length; i++) {
  // 		// 	if (locationForecast.list[i].dt_txt.includes("00:00:00") && i < 30) {
  // 		// 		let dailyCountingTemp = 0;
  // 		// 		let dailyMinTemp = 0;
  // 		// 		let dailyMaxTemp = 999999;
  // 		// 		for (let j = 0; j < 9; j++) {
  // 		// 			dailyCountingTemp = dailyCountingTemp + locationForecast.list[i + j].main.temp;
  // 		// 			if (locationForecast.list[i + j].main.temp_min < dailyMinTemp) {
  // 		// 				dailyMinTemp = locationForecast.list[i + j].main.temp_min;
  // 		// 			}
  // 		// 			if (locationForecast.list[i + j].main.temp_max < dailyMaxTemp) {
  // 		// 				dailyMaxTemp = locationForecast.list[i + j].main.temp_max;
  // 		// 			}
  // 		// 		}
  // 		// 		dailyCountingTemp = dailyCountingTemp / 8;

  // 		// 		forecastArray.push({
  // 		// 			temp: dailyCountingTemp,
  // 		// 			tempMin: dailyMinTemp,
  // 		// 			tempMax: dailyMaxTemp,
  // 		// 			feelsLike: locationForecast.list[i + 5].main.feels_like,
  // 		// 			humidity: locationForecast.list[i + 5].main.humidity,
  // 		// 			description: locationForecast.list[i + 5].weather[0].main,
  // 		// 			windSpeed: locationForecast.list[i + 5].wind.speed,
  // 		// 			icon: `http://openweathermap.org/img/w/${locationForecast.list[i + 5].weather[0].icon}.png`,
  // 		// 			timestamp: locationForecast.list[i + 5].dt,
  // 		// 		});
  // 		// 	}
  // 		if (locationForecast.list[i].dt_txt.includes("15:00:00")) {
  // 			forecastArray.push({
  // 				temp: locationForecast.list[i].main.temp,
  // 				tempMin: locationForecast.list[i].main.temp_min,
  // 				tempMax: locationForecast.list[i].main.temp_max,
  // 				feelsLike: locationForecast.list[i].main.feels_like,
  // 				humidity: locationForecast.list[i].main.humidity,
  // 				description: locationForecast.list[i].weather[0].main,
  // 				windSpeed: locationForecast.list[i].wind.speed,
  // 				icon: `http://openweathermap.org/img/w/${locationForecast.list[i].weather[0].icon}.png`,
  // 				timestamp: locationForecast.list[i].dt,
  // 			});
  // 		}
  // 	}
  // 	console.log("The forecast array is: ", forecastArray);
  // 	setForecast(forecastArray);
  // }, [locationForecast]);

  useEffect(() => {
    if (!locationDetails) return;
    setFetchedCountryName(locationDetails);
  }, [locationDetails]);

  useEffect(() => {
    if (!cityForecast) return;

    const goodWeather =
      "clear" || "sun" || "sunny" || "mostly sunny" || "partly cloudy";
    const badWeather =
      "rain" ||
      "rainy" ||
      "scattered showers" ||
      "showers" ||
      "rain and snow" ||
      "storms" ||
      "storm" ||
      "thunder" ||
      "thunderstorms" ||
      "lightning" ||
      "hail" ||
      "hail storm" ||
      "hailing" ||
      "snow storm";

    let pointTally = 0;
    let count = 0;

    // Do filter process
    for (let i = 0; i < cityForecast.length; i++) {
      if (cityForecast[i]?.text.toLowerCase() == goodWeather) {
        pointTally++;
      } else if (cityForecast[i]?.text.toLowerCase() == badWeather) {
        pointTally--;
      }
      count++;
    }
    console.log("The point tally is ", pointTally);
    if (pointTally / count < -20) {
      setHiddenResult(true);
    }
  }, [cityForecast]);

  useEffect(() => {
    console.log("Rendering component");
  }, []);

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
    <div ref={resultRef}>
      {cityBasicDetails ? (
        <div
          key={cityName}
          className={`${
            hiddenResult && "hidden"
          } grid grid-rows-7 p-4 rounded border space-y-2 shadow transition transform ease-in-out bg-white ${
            isUserHere && "!bg-blue-50 hover:bg-blue-200"
          } ${!isUserHere && "hover:bg-gray-50"}`}
        >
          {isLoadingCityBasicDetails ? (
            <div className="w-full flex justify-center items-center p-6">
              <Ring />
            </div>
          ) : (
            <img
              src={
                mainImageUrl != "" ? mainImageUrl : "/no-image-placeholder.jpg"
              }
              alt={cityName}
              className="row-span-1 w-full h-28 object-cover rounded self-center shadow"
            />
          )}
          <div className="row-span-1">
            <h2 className="text-xl font-black">{cityName}</h2>
            <h3 className="text-gray-500">{countryName}</h3>
            {isUserHere ? (
              <div className="flex items-center space-x-4 font-bold text-blue-500 my-4">
                <RiUserLocationLine size={20} />
                <p>You are here now</p>
              </div>
            ) : (
              <div className="flex flex-col justify-center my-4">
                {isFarPlace ? (
                  <div className="bg-yellow-500 p-2 rounded-full flex justify-center items-center font-semibold space-x-2 text-gray-900">
                    <BiBadgeCheck />
                    <p>Popular!</p>
                  </div>
                ) : (
                  <div className="bg-blue-500 p-2 rounded-full flex justify-center items-center font-semibold space-x-2 text-gray-100">
                    <BiCurrentLocation />
                    <p>Near you</p>
                  </div>
                )}
                {/* {flightTime && (
							<div className="w-full flex justify-center items-center space-x-2">
								<RiPlaneLine />
								<p className="text-gray-500">{flightTime}</p>
							</div>
						)}
						{transportTime && (
							<div className="w-full flex justify-center items-center space-x-2">
								<RiTrainFill />
								<p className="text-gray-500">{transportTime}</p>
							</div>
						)} */}
                {driveTime && (
                  <div className="w-full flex justify-center items-center space-x-2">
                    <RiCarFill />
                    <p className="text-gray-500">{driveTime}</p>
                  </div>
                )}
                {distance > 15 && (
                  <div className="w-full flex justify-center items-center space-x-2">
                    <p className="text-gray-500">{`${distance.toFixed(
                      0
                    )} miles ${isViewingHome ? "from you" : "away"}`}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex sm:hidden justify-center items-center text-sm border ${
              expanded ? "bg-blue-100 text-blue-500" : "bg-blue-500 text-white"
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

          {cityForecast ? (
            <div
              className={`${
                expanded ? "row-span-1" : "hidden"
              } sm:row-span-1 sm:flex sm:flex-col`}
              ref={weatherCellsRef}
            >
              {cityForecast
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
                  ))}
              <button
                className="flex justify-center items-center space-x-3 bg-blue-500 rounded-full text-white font-semibold p-2"
                onClick={() => setIsExtended(!isExtended)}
              >
                {/* {!isExtended ? <BiChevronsDown /> : <BiChevronsUp />}{" "} */}
                {`${!isExtended ? "Show More" : "Show Less"}`}{" "}
                {!isExtended ? <BiChevronsDown /> : <BiChevronsUp />}
              </button>
            </div>
          ) : null}

          {/* Old Version with openweathermap */}
          {/* {isLoading ? <Ring /> : <div className="row-span-1">{forecast && forecast.map(({ temp, tempMin, tempMax, feelsLike, humidity, windSpeed, description, icon, timestamp }, i) => <WeatherCell key={i} temp={temp} tempMin={tempMin} tempMax={tempMax} feelsLike={feelsLike} humidity={humidity} windSpeed={windSpeed} description={description} icon={icon} timestamp={timestamp} />)}</div>} */}

          {/* <button
				onClick={() => {
					setSelectedCityName(cityName);
					setSelectedCountryName(fetchedCountryName);
					setSelectedCityLat(latitude);
					setSelectedCityLong(longitude);
					setSelectedCityDriveTime(driveTime);
					setSelectedCityWeatherData(forecast ?? []);
					setIsLocationModalOpen(true);
				}}
				className={`row-span-1 text-blue-500 font-bold shadow rounded h-12 ${isUserHere ? "bg-gray-100 hover:bg-gray-200" : "bg-blue-100 hover:bg-blue-200"}`}
			>
				BOOK
			</button> */}
        </div>
      ) : isLoadingCityBasicDetails ? (
        <div className="flex justify-center items-center">
          <Ring />
        </div>
      ) : null}
    </div>
  );
}
export default memo(CityResultVertical);
