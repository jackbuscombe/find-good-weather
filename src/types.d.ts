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
