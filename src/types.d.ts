import { countryCodes } from "../public/countryCodes";

export type WeatherObject = {
  description: string;
  feelsLike: number;
  humidity: number;
  icon: string;
  temp: number;
  tempMax: number;
  tempMin: number;
  timestamp: number;
  windSpeed: number;
};

export type YahooWeatherObject = {
  day: string;
  date: number;
  low: number;
  high: number;
  text: string;
};

export type WeatherApiWeatherObject = {
  //   cityName: string;
  //   countryName: string;
  //   forecast: {
  date: number;
  temp_c: number;
  temp_f: number;
  temp_max_c: number;
  temp_max_f: number;
  temp_min_c: number;
  temp_min_f: number;
  condition: number;
  //   }[];
};

export type ForecastObject = {
  date: number;
  temp_c: number;
  temp_f: number;
  temp_max_c: number;
  temp_max_f: number;
  temp_min_c: number;
  temp_min_f: number;
  condition: string;
};

export type GeonameResponse = {
  _id: any;
  id: string;
  name: string;
  location: { type: string; coordinates: [number, number] };
  countryCode: keyof typeof countryCodes;
};

export type GeonameResult = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  countryName: string;
  distance: number;
  isFarPlace: boolean;
};

export type Flight = {
  value: number;
  trip_class: 0 | 1 | 2;
  show_to_affiliates: boolean;
  origin: string;
  destination: string;
  gate: string;
  depart_date: string;
  return_date: string;
  number_of_changes: number;
  found_at: string;
  duration: number;
  distance: number;
  actual: boolean;
};
