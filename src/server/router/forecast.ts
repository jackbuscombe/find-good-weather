import { createRouter } from "./context";
import { z } from "zod";
import axios from "axios";

export const forecastRouter = createRouter()
	.query("getForecast", {
		input: z.object({
			latitude: z.number(),
			longitude: z.number(),
		}),
		async resolve({ input }) {
			try {
				const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${input.latitude}&lon=${input.longitude}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`);
				return response.data;
			} catch (error) {
				console.log("Error Fetching Forecast", error);
				return error;
			}
		},
	})
	.query("getForecastFromCityName", {
		input: z.object({
			locationName: z.string(),
		}),
		async resolve({ input }) {
			try {
				// Must convert result from google map to lat and long
				const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${input.locationName}&lon=${input.locationName}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`);
				return response.data;
			} catch (error) {
				console.log("Error Fetching Forecast", error);
				return error;
			}
		},
	})
	.query("getAll", {
		async resolve({ ctx }) {
			return await ctx.prisma.example.findMany();
		},
	});
