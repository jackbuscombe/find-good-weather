import { Switch } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { GiForwardSun } from "react-icons/gi";
import { TbSun } from "react-icons/tb";
import { useStore } from "../components/appStore";

const top10Countries = [
  {
    cityName: "Berlin",
    countryName: "Germany",
    lat: 52.520008,
    long: 13.404954,
  },
  { cityName: "Madrid", countryName: "Spain", lat: 40.416775, long: -3.70379 },
  {
    cityName: "New York",
    countryName: "United States",
    lat: 52.370216,
    long: 4.895168,
  },
  {
    cityName: "Vienna",
    countryName: "Austria",
    lat: 48.208176,
    long: 16.373819,
  },
  { cityName: "Rome", countryName: "Italy", lat: 41.902782, long: 12.496365 },
  {
    cityName: "Stockholm",
    countryName: "Sweden",
    lat: 59.329323,
    long: 18.068581,
  },
  {
    cityName: "Bangkok",
    countryName: "Thailand",
    lat: 13.756331,
    long: 100.501762,
  },
  { cityName: "Athens", countryName: "Greece", lat: 37.98381, long: 23.727539 },
  { cityName: "Tokyo", countryName: "Japan", lat: 35.689487, long: 139.691711 },
  {
    cityName: "Sydney",
    countryName: "Australia",
    lat: -33.86882,
    long: 151.20929,
  },
];
const top10Cities = [
  {
    cityName: "Amsterdam",
    countryName: "Netherlands",
    lat: 52.370216,
    long: 4.895168,
  },
  {
    cityName: "New York",
    countryName: "United States of America",
    lat: 40.712776,
    long: -74.005974,
  },
  {
    cityName: "Los Angeles",
    countryName: "United States of America",
    lat: 34.052235,
    long: -118.243683,
  },
  {
    cityName: "Dallas",
    countryName: "United States of America",
    lat: 32.776665,
    long: -96.796989,
  },
  {
    cityName: "Miami",
    countryName: "United States of America",
    lat: 25.761681,
    long: -80.191788,
  },
  { cityName: "Paris", countryName: "France", lat: 48.856613, long: 2.352222 },
  {
    cityName: "London",
    countryName: "England",
    lat: 51.507351,
    long: -0.127758,
  },
  {
    cityName: "Newark",
    countryName: "United States of America",
    lat: 37.443188,
    long: -95.582733,
  },
  {
    cityName: "Barcelona",
    countryName: "Spain",
    lat: 41.385063,
    long: 2.173404,
  },
  {
    cityName: "Richmond",
    countryName: "United States of America",
    lat: 37.540726,
    long: -77.43605,
  },
];

function Footer() {
  const router = useRouter();
  const celsius = useStore((state) => state.celsius);
  const setCelsius = useStore((state) => state.setCelsius);

  const selectedCityName = useStore((state) => state.selectedCityName);
  const setSelectedCityName = useStore((state) => state.setSelectedCityName);
  const selectedCountryName = useStore((state) => state.selectedCountryName);
  const setSelectedCountryName = useStore(
    (state) => state.setSelectedCountryName
  );
  const isLocationModalOpen = useStore((state) => state.isLocationModalOpen);
  const setIsLocationModalOpen = useStore(
    (state) => state.setIsLocationModalOpen
  );
  const selectedCityLat = useStore((state) => state.selectedCityLat);
  const setSelectedCityLat = useStore((state) => state.setSelectedCityLat);
  const selectedCityLong = useStore((state) => state.selectedCityLong);
  const setSelectedCityLong = useStore((state) => state.setSelectedCityLong);
  const selectedCityDriveTime = useStore(
    (state) => state.selectedCityDriveTime
  );
  const setSelectedCityDriveTime = useStore(
    (state) => state.setSelectedCityDriveTime
  );
  const selectedCityWeatherData = useStore(
    (state) => state.selectedCityWeatherData
  );
  const setSelectedCityWeatherData = useStore(
    (state) => state.setSelectedCityWeatherData
  );

  return (
    <footer className="bg-zinc-900 p-16 shadow text-white space-y-12">
      <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-y-20">
        <div className="flex mb-6 lg:mb-0 justify-center lg:justify-start items-center lg:items-start space-x-4 text-xl font-semibold cursor-pointer">
          <TbSun className="text-yellow-400 text-4xl" />
          <p className="text-white font-mono">GoodWeather.ai</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 lg:space-x-6 mb-8 lg:mb-0 text-center lg:text-start">
          <div className="col-span-3 lg:col-span-1 mb-2 lg:mb-0">
            <p className="text-gray-500">Top 10 countries of the week</p>
          </div>
          <div>
            <ul className="space-y-4">
              {top10Countries
                .slice(0, 5)
                .map(({ cityName, countryName, lat, long }) => (
                  <li
                    onClick={() => {
                      setIsLocationModalOpen(true);
                      setSelectedCityName(cityName);
                      setSelectedCountryName(countryName);
                      setSelectedCityLat(lat);
                      setSelectedCityLong(long);
                      setSelectedCityDriveTime("");
                      setSelectedCityWeatherData([]);
                    }}
                    key={countryName}
                    className="hover:underline cursor-pointer"
                  >
                    {countryName}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <ul className="space-y-4">
              {top10Countries
                .slice(5, 10)
                .map(({ cityName, countryName, lat, long }) => (
                  <li
                    onClick={() => {
                      setIsLocationModalOpen(true);
                      setSelectedCityName(cityName);
                      setSelectedCountryName(countryName);
                      setSelectedCityLat(lat);
                      setSelectedCityLong(long);
                      setSelectedCityDriveTime("");
                      setSelectedCityWeatherData([]);
                    }}
                    key={countryName}
                    className="hover:underline cursor-pointer"
                  >
                    {countryName}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 lg:space-x-6 mb-8 lg:mb-0 text-center lg:text-start">
          <div className="col-span-3 lg:col-span-1 mb-2 lg:mb-0">
            <p className="text-gray-500">Top 10 cities of the week</p>
          </div>
          <div>
            <ul className="space-y-4">
              {top10Cities
                .slice(0, 5)
                .map(({ cityName, countryName, lat, long }) => (
                  <li
                    onClick={() => {
                      setIsLocationModalOpen(true);
                      setSelectedCityName(cityName);
                      setSelectedCountryName(countryName);
                      setSelectedCityLat(lat);
                      setSelectedCityLong(long);
                      setSelectedCityDriveTime("");
                      setSelectedCityWeatherData([]);
                    }}
                    key={cityName}
                    className="hover:underline cursor-pointer"
                  >
                    {cityName}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <ul className="space-y-4">
              {top10Cities
                .slice(5, 10)
                .map(({ cityName, countryName, lat, long }) => (
                  <li
                    onClick={() => {
                      setIsLocationModalOpen(true);
                      setSelectedCityName(cityName);
                      setSelectedCountryName(countryName);
                      setSelectedCityLat(lat);
                      setSelectedCityLong(long);
                      setSelectedCityDriveTime("");
                      setSelectedCityWeatherData([]);
                    }}
                    key={cityName}
                    className="hover:underline cursor-pointer"
                  >
                    {cityName}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <p className="col-span-2 text-gray-500 text-center lg:text-left my-4">
          The burgers are better at Hungry Jacks
        </p>
        <div className="flex items-center justify-center lg:justify-start flex-col lg:flex-row lg:space-x-16">
          <div className="flex justify-center lg:justify-start items-center space-x-6 mb-8 lg:mb-0">
            <p>Share social</p>
            <FaFacebook className="text-2xl cursor-pointer hover:text-gray-400" />
            <FaLinkedin className="text-2xl cursor-pointer hover:text-gray-400" />
          </div>
          <div className="flex justify-center lg:justify-start items-center space-x-4 cursor-pointer">
            <p className="cursor-pointer">°F</p>
            <Switch
              className="cursor-pointer"
              checked={celsius}
              onChange={(event) => setCelsius(event.currentTarget.checked)}
              color="dark"
              size="lg"
              thumbIcon={
                celsius ? (
                  <p className="text-green-500 font-bold cursor-pointer">°C</p>
                ) : (
                  <p className="text-green-500 font-bold cursor-pointer">°F</p>
                )
              }
            />
            <p className="cursor-pointer">°C</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
