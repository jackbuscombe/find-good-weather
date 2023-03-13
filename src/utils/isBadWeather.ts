import { WeatherApiWeatherObject } from "../types";

export default function isBadWeather(forecast: WeatherApiWeatherObject[]) {
  const goodWeather = [
    "clear",
    "sun",
    "sunny",
    "mostly sunny",
    "mostly clear",
    "partly cloudy",
    "fog",
  ];
  const badWeather = [
    "rain",
    "rainy",
    "scattered showers",
    "showers",
    "rain and snow",
    "storms",
    "storm",
    "thunder",
    "thunderstorms",
    "lightning",
    "hail",
    "hail storm",
    "hailing",
    "snow storm",
    "patchy rain possible",
    "moderate rain",
    "heavy rain",
    "patchy rain nearby",
    "partly cloudy",
    "heavy rain",
    "moderate or heavy rain shower",
    "moderate or heavy snow showers",
    "moderate rain at times",
    "heavy rain at times",
  ];

  let pointTally = 0;
  let count = 0;

  // Do filter process
  for (let i = 0; i < forecast.length; i++) {
    if (goodWeather.includes((forecast[i]?.condition ?? "").toLowerCase())) {
      pointTally++;
    }
    if (badWeather.includes((forecast[i]?.condition ?? "").toLowerCase())) {
      pointTally--;
    }

    // if (
    //   (getWeatherDescriptionFromCode as { [index: number]: string })[
    //     cityForecast.forecast[i]?.condition as number
    //   ] == goodWeather
    // ) {
    //   pointTally++;
    // } else if (
    //   (getWeatherDescriptionFromCode as { [index: number]: string })[
    //     cityForecast.forecast[i]?.condition as number
    //   ] == badWeather
    // ) {
    //   pointTally--;
    // }
    count++;
  }

  if (pointTally / count < 0) {
    return true;
  } else {
    return false;
  }
}
