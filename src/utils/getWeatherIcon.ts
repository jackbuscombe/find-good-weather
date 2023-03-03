const sunPath = "/weather_icons/sun.svg";
const rainPath = "/weather_icons/rain.svg";
const cloudyPath = "/weather_icons/cloud.svg";
const stormyPath = "/weather_icons/storm.svg";
const windyPath = "/weather_icons/wind.svg";
const hailPath = "/weather_icons/hail.svg";
const snowPath = "/weather_icons/snow.svg";

const sunPathCurrent = "/weather_icons/sun_current.svg";
const rainPathCurrent = "/weather_icons/rain_current.svg";
const cloudyPathCurrent = "/weather_icons/cloud_current.svg";
const stormyPathCurrent = "/weather_icons/storm_current.svg";
const windyPathCurrent = "/weather_icons/wind_current.svg";
const hailPathCurrent = "/weather_icons/hail_current.svg";
const snowPathCurrent = "/weather_icons/snow_current.svg";

export default function getWeatherIcon(weather: string) {
  switch (weather.toLowerCase()) {
    case "clear":
      return sunPath;
    case "mostly clear":
      return sunPath;
    case "sun":
      return sunPath;
    case "sunny":
      return sunPath;
    case "mostly sunny":
      return sunPath;

    case "scattered showers":
      return rainPath;
    case "showers":
      return rainPath;
    case "rain":
      return rainPath;
    case "rain and snow":
      return rainPath;
    case "patchy rain possible":
      return rainPath;
    case "moderate rain":
      return rainPath;
    case "heavy rain":
      return rainPath;
    case "patchy rain nearby":
      return rainPath;
    case "moderate or heavy rain shower":
      return rainPath;
    case "moderate rain at times":
      return rainPath;
    case "heavy rain at times":
      return rainPath;

    case "cloudy":
      return cloudyPath;
    case "mostly cloudy":
      return cloudyPath;
    case "partly cloudy":
      return cloudyPath;
    case "overcast":
      return cloudyPath;
    case "fog":
      return cloudyPath;

    case "storms":
      return stormyPath;
    case "storm":
      return stormyPath;
    case "thunder":
      return stormyPath;
    case "thunderstorms":
      return stormyPath;
    case "lightning":
      return stormyPath;

    case "windy":
      return windyPath;
    case "wind":
      return windyPath;

    case "hail":
      return hailPath;
    case "hailing":
      return hailPath;
    case "hail storm":
      return hailPath;

    case "snow":
      return snowPath;
    case "snow":
      return snowPath;
    case "snow storm":
      return snowPath;
    case "sleet":
      return snowPath;
    case "moderate or heavy snow showers":
      return snowPath;
    default:
  }
}

export function getWeatherIconCurrent(weather: string) {
  switch (weather.toLowerCase()) {
    case "clear":
      return sunPathCurrent;
    case "mostly clear":
      return sunPathCurrent;
    case "sun":
      return sunPathCurrent;
    case "sunny":
      return sunPathCurrent;
    case "mostly sunny":
      return sunPathCurrent;

    case "scattered showers":
      return rainPathCurrent;
    case "showers":
      return rainPathCurrent;
    case "rain":
      return rainPathCurrent;
    case "rain and snow":
      return rainPathCurrent;
    case "patchy rain possible":
      return rainPathCurrent;
    case "moderate rain":
      return rainPathCurrent;
    case "heavy rain":
      return rainPathCurrent;
    case "patchy rain nearby":
      return rainPathCurrent;
    case "moderate or heavy rain shower":
      return rainPathCurrent;
    case "moderate rain at times":
      return rainPathCurrent;
    case "heavy rain at times":
      return rainPathCurrent;

    case "cloudy":
      return cloudyPathCurrent;
    case "mostly cloudy":
      return cloudyPathCurrent;
    case "partly cloudy":
      return cloudyPathCurrent;
    case "overcast":
      return cloudyPathCurrent;
    case "fog":
      return cloudyPathCurrent;

    case "storms":
      return stormyPathCurrent;
    case "storm":
      return stormyPathCurrent;
    case "thunder":
      return stormyPathCurrent;
    case "thunderstorms":
      return stormyPathCurrent;
    case "lightning":
      return stormyPathCurrent;

    case "windy":
      return windyPathCurrent;
    case "wind":
      return windyPathCurrent;

    case "hail":
      return hailPathCurrent;
    case "hailing":
      return hailPathCurrent;
    case "hail storm":
      return hailPathCurrent;

    case "snow":
      return snowPathCurrent;
    case "snow":
      return snowPathCurrent;
    case "snow storm":
      return snowPathCurrent;
    case "sleet":
      return snowPathCurrent;
    case "moderate or heavy snow showers":
      return snowPathCurrent;
    default:
  }
}
