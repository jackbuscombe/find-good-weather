export default function (weather: string) {
	switch (weather.toLowerCase()) {
		case "scattered showers":
			return "/weather_icons/rain-icon-transparent.gif";
		case "showers":
			return "/weather_icons/rain-icon-transparent.gif";
		case "rain":
			return "/weather_icons/rain-icon-transparent.gif";
		case "rain and snow":
			return "/weather_icons/rain-icon-transparent.gif";

		case "cloudy":
			return "/weather_icons/partly-cloudy-icon-transparent.gif";
		case "mostly cloudy":
			return "/weather_icons/partly-cloudy-icon-transparent.gif";
		case "partly cloudy":
			return "/weather_icons/partly-cloudy-icon-transparent.gif";

		case "clear":
			return "/weather_icons/sun-icon-transparent.gif";
		case "sun":
			return "/weather_icons/sun-icon-transparent.gif";
		case "sunny":
			return "/weather_icons/sun-icon-transparent.gif";
		case "mostly sunny":
			return "/weather_icons/sun-icon-transparent.gif";

		case "storms":
			return "/weather_icons/storm-icon-transparent.gif";
		case "storm":
			return "/weather_icons/storm-icon-transparent.gif";
		case "thunder":
			return "/weather_icons/storm-icon-transparent.gif";
		case "thunderstorms":
			return "/weather_icons/storm-icon-transparent.gif";
		case "lightning":
			return "/weather_icons/storm-icon-transparent.gif";
		default:
	}
}
