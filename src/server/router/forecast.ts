import { createRouter } from "./context";
import { z } from "zod";
import axios from "axios";
import { YahooWeatherObject } from "../../types";

export const forecastRouter = createRouter()
	.query("getForecast", {
		input: z.object({
			latitude: z.number(),
			longitude: z.number(),
		}),
		async resolve({ input }) {
			try {
				const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${input.latitude}&lon=${input.longitude}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
				return response.data;
			} catch (error) {
				console.log("Error Fetching Forecast", error);
				return error;
			}
		},
	})
	.query("getYahooForecastByLatLong", {
		input: z.object({
			latitude: z.number(),
			longitude: z.number(),
		}),
		async resolve({ input }) {
			try {
				const options = {
					method: "GET",
					url: "https://yahoo-weather5.p.rapidapi.com/weather",
					params: { lat: input.latitude, long: input.longitude, format: "json", u: "c" },
					headers: {
						"X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY as string,
						"X-RapidAPI-Host": process.env.X_RAPIDAPI_HOST_YAHOO_WEATHER as string,
					},
				};
				const result = await axios.request(options);

				const forecastArray: YahooWeatherObject[] = [];
				for (let i = 0; i < result.data.forecasts.length; i++) {
					forecastArray.push({
						day: result.data.forecasts[i].day,
						date: result.data.forecasts[i].date,
						low: result.data.forecasts[i].low,
						high: result.data.forecasts[i].high,
						text: result.data.forecasts[i].text,
					});
				}
				return forecastArray;
			} catch (error) {
				// console.log("Error Fetching Forecast", error);
			}
		},
	});
