import { add } from "date-fns";
import create from "zustand";
import { WeatherApiWeatherObject, WeatherObject } from "../types";

type NearbyCity = {
  cityName: string;
  countryName: string;
  distance: number;
  driveTime: number;
  flightTime: number;
  imageUrl: string;
  isUserHere: boolean;
  lat: number;
  long: number;
  population: number;
  transportTime: number;
  weatherData: number[];
  cityId: string;
};

type State = {
  selectedCityName: string;
  selectedCountryName: string;
  selectedLocationId: string;
  selectedCityDriveTime: string;
  selectedCityFlightTime: string;
  selectedCityTransitTime: string;
  selectedCityWeatherData: WeatherApiWeatherObject[];
  selectedCityFlightLink: string;
  peopleCount: number;
  desiredWeather: string;
  startDate: Date;
  endDate: Date;
  celsius: boolean;
  viewType: string;
  transportModes: string[];
  userFullLocationName: string;
  userCity: string;
  userCountry: string;
  userCurrency: string;
  userPlaceId: string;
  userWeather: string;
  userTemp: number;
  userLat: number;
  userLong: number;
  selectedCityLat: number;
  selectedCityLong: number;
  searchedCityLat: number;
  searchedCityLong: number;
  isLocationModalOpen: boolean;
  nearbyCitiesArray: NearbyCity[];
  isViewingHome: boolean;
  currentAirportIata: string;
  selectedAirportIata: string;
  setSelectedCityName: (cityName: string) => void;
  setSelectedCountryName: (countryName: string) => void;
  setSelectedLocationId: (locationId: string) => void;
  setSelectedCityDriveTime: (driveTime: string) => void;
  setSelectedCityFlightTime: (flightTime: string) => void;
  setSelectedCityTransitTime: (transportTime: string) => void;
  setSelectedCityWeatherData: (weatherData: WeatherApiWeatherObject[]) => void;
  setSelectedCityFlightLink: (link: string) => void;
  setPeopleCount: (people: number) => void;
  setDesiredWeather: (weather: string) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  setCelsius: (celsius: boolean) => void;
  setViewType: (type: string) => void;
  setTransportModes: (map: string[]) => void;
  setUserFullLocationName: (locationName: string) => void;
  setUserCity: (city: string) => void;
  setUserCountry: (country: string) => void;
  setUserCurrency: (currency: string) => void;
  setUserPlaceId: (city: string) => void;
  setUserWeather: (weather: string) => void;
  setUserTemp: (temp: number) => void;
  setUserLat: (latitude: number) => void;
  setUserLong: (longitude: number) => void;
  setSelectedCityLat: (latitude: number) => void;
  setSelectedCityLong: (longitude: number) => void;
  setSearchedCityLat: (latitude: number) => void;
  setSearchedCityLong: (longitude: number) => void;
  setIsLocationModalOpen: (isOpen: boolean) => void;
  setNearbyCitiesArray: (array: NearbyCity[]) => void;
  setIsViewingHome: (isViewingHome: boolean) => void;
  setCurrentAirportIata: (currentAirportIata: string) => void;
  setSelectedAirportIata: (selectedAirportIata: string) => void;
};

export const useStore = create<State>((set) => ({
  selectedCityName: "",
  selectedCountryName: "",
  selectedLocationId: "",
  selectedCityDriveTime: "",
  selectedCityFlightTime: "",
  selectedCityTransitTime: "",
  selectedCityWeatherData: [],
  selectedCityFlightLink: "",
  peopleCount: 2,
  desiredWeather: "clear",
  startDate: add(new Date(), { days: 0 }),
  endDate: add(new Date(), { days: 9 }),
  celsius: true,
  viewType: "vertical",
  transportModes: ["airplane", "train", "car"],
  userFullLocationName: "",
  userCity: "",
  userCountry: "",
  userCurrency: "",
  userPlaceId: "",
  userWeather: "",
  userTemp: 0,
  userLat: 0,
  userLong: 0,
  selectedCityLat: 0,
  selectedCityLong: 0,
  searchedCityLat: 0,
  searchedCityLong: 0,
  isLocationModalOpen: false,
  nearbyCitiesArray: [],
  isViewingHome: true,
  currentAirportIata: "",
  selectedAirportIata: "",
  setSelectedCityName: (cityName) => set({ selectedCityName: cityName }),
  setSelectedCountryName: (countryName) =>
    set({ selectedCountryName: countryName }),
  setSelectedLocationId: (locationId) =>
    set({ selectedLocationId: locationId }),
  setSelectedCityDriveTime: (driveTime: string) =>
    set({ selectedCityDriveTime: driveTime }),
  setSelectedCityFlightTime: (flightTime: string) =>
    set({ selectedCityFlightTime: flightTime }),
  setSelectedCityTransitTime: (transitTime: string) =>
    set({ selectedCityTransitTime: transitTime }),
  setSelectedCityWeatherData: (weatherData: WeatherApiWeatherObject[]) =>
    set({ selectedCityWeatherData: weatherData }),
  setSelectedCityFlightLink: (link: string) =>
    set({ selectedCityFlightLink: link }),
  setPeopleCount: (people: number) => set({ peopleCount: people }),
  setDesiredWeather: (weather: string) => set({ desiredWeather: weather }),
  setStartDate: (date: Date) => set({ startDate: date }),
  setEndDate: (date: Date) => set({ endDate: date }),
  setCelsius: (celsius) => set({ celsius: celsius }),
  setViewType: (type) => set({ viewType: type }),
  setTransportModes: (modes) => set({ transportModes: modes }),
  setUserFullLocationName: (location) =>
    set({ userFullLocationName: location }),
  setUserCity: (city) => set({ userCity: city }),
  setUserCountry: (country) => set({ userCountry: country }),
  setUserCurrency: (currency) => set({ userCurrency: currency }),
  setUserPlaceId: (placeId) => set({ userPlaceId: placeId }),
  setUserWeather: (weather) => set({ userWeather: weather }),
  setUserTemp: (temp) => set({ userTemp: temp }),
  setUserLat: (latitude) => set({ userLat: latitude }),
  setUserLong: (longitude) => set({ userLong: longitude }),
  setSelectedCityLat: (latitude) => set({ selectedCityLat: latitude }),
  setSelectedCityLong: (longitude) => set({ selectedCityLong: longitude }),
  setSearchedCityLat: (latitude) => set({ searchedCityLat: latitude }),
  setSearchedCityLong: (longitude) => set({ searchedCityLong: longitude }),
  setIsLocationModalOpen: (isOpen) => set({ isLocationModalOpen: isOpen }),
  setNearbyCitiesArray: (array) => set({ nearbyCitiesArray: array }),
  setIsViewingHome: (isViewingHome) => set({ isViewingHome: isViewingHome }),
  setCurrentAirportIata: (currentAirportIata) => set({ currentAirportIata }),
  setSelectedAirportIata: (selectedAirportIata) => set({ selectedAirportIata }),
}));
