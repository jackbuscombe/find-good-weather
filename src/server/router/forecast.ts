import { createRouter } from "./context";
import { z } from "zod";
import axios from "axios";
import { WeatherApiWeatherObject, YahooWeatherObject } from "../../types";
import { add, format } from "date-fns";
import isBadWeather from "../../utils/isBadWeather";

export const forecastRouter = createRouter()
  .query("getForecast", {
    input: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
    async resolve({ input }) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${input.lat}&lon=${input.lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );
        return response.data;
      } catch (error) {
        console.log("Error Fetching Forecast", error);
        return error;
      }
    },
  })
  .query("getYahooForecastByLatLong", {
    input: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
    async resolve({ input }) {
      try {
        const options = {
          method: "GET",
          url: "https://yahoo-weather5.p.rapidapi.com/weather",
          params: {
            lat: input.lat,
            long: input.lon,
            format: "json",
            u: "c",
          },
          headers: {
            "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY as string,
            "X-RapidAPI-Host": process.env
              .X_RAPIDAPI_HOST_YAHOO_WEATHER as string,
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
  })
  .query("getWeatherApiForecastByLatLongOld", {
    input: z.object({
      lat: z.number(),
      lon: z.number(),
      days: z.optional(z.number()),
      isHome: z.boolean(),
    }),
    async resolve({ input }) {
      try {
        const response = await axios.get(
          `http://api.weatherapi.com/v1/forecast.json?key=${
            process.env.WEATHERAPI_API_TOKEN
          }&q=${input.lat},${input.lon}&days=${
            input.days ?? 10
          }&aqi=no&alerts=no`
        );

        // console.log("Weather response: ", response.data);

        const cityName: string = response.data.location.name;
        const countryName: string = response.data.location.country;
        const forecast: WeatherApiWeatherObject[] = [];
        for (let i = 0; i < response.data.forecast.forecastday.length; i++) {
          forecast.push({
            date: response.data.forecast.forecastday[i].date_epoch,
            temp_c: response.data.forecast.forecastday[i].day.avgtemp_c,
            temp_f: response.data.forecast.forecastday[i].day.avgtemp_f,
            temp_max_c: response.data.forecast.forecastday[i].day.maxtemp_c,
            temp_max_f: response.data.forecast.forecastday[i].day.maxtemp_f,
            temp_min_c: response.data.forecast.forecastday[i].day.mintemp_c,
            temp_min_f: response.data.forecast.forecastday[i].day.mintemp_f,
            condition: response.data.forecast.forecastday[i].day.condition.text,
            conditionCode:
              response.data.forecast.forecastday[i].day.condition.code,
          });
        }

        // console.log("Forecast: ", forecast);
        return forecast;
      } catch (error) {
        console.log("Error Fetching New Forecast", error);
        // return error;
      }
    },
  })
  .query("getWeatherApiForecastByLatLong", {
    input: z.object({
      lat: z.number(),
      lon: z.number(),
      days: z.optional(z.number()),
      isHome: z.boolean(),
    }),
    async resolve({ input }) {
      const weatherResponse = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPI_API_TOKEN}&q=${input.lat},${input.lon}&days=10&aqi=no&alerts=no`
      );

      const weatherResponseResult = weatherResponse.data.forecast.forecastday;

      const forecast: WeatherApiWeatherObject[] = [];

      for (let j = 0; j < weatherResponseResult.length; j++) {
        forecast.push({
          date: weatherResponseResult[j].date_epoch,
          temp_c: weatherResponseResult[j].day.avgtemp_c,
          temp_f: weatherResponseResult[j].day.avgtemp_f,
          temp_max_c: weatherResponseResult[j].day.maxtemp_c,
          temp_max_f: weatherResponseResult[j].day.maxtemp_f,
          temp_min_c: weatherResponseResult[j].day.mintemp_c,
          temp_min_f: weatherResponseResult[j].day.mintemp_f,
          condition: weatherResponseResult[j].day.condition.text,
          conditionCode: weatherResponseResult[j].day.condition.code,
        });
      }

      // Only Return if GoodWeather
      if (input.isHome || !isBadWeather(forecast)) {
        return forecast;
      }
    },
  })
  .query("getWeatherApiFutureByLatLongDate", {
    input: z.object({
      lat: z.number(),
      lon: z.number(),
      startDate: z.date(), // Date between 14 days and 300 days from today in the future in yyyy-MM-dd format
      endDate: z.date(), // Date between 14 days and 300 days from today in the future in yyyy-MM-dd format
    }),
    async resolve({ input }) {
      try {
        // Prepare an array of dates
        const dateArray = [];
        for (
          let i = 0;
          i < 10;
          // format(add(input.startDate, { days: i }), "yyyy-MM-dd") ==
          // format(input.endDate, "yyyy-MM-dd");
          i++
        ) {
          dateArray.push(
            format(add(input.startDate, { days: i }), "yyyy-MM-dd")
          );
        }

        const forecastArray = [];

        if (dateArray.length == 0) return;

        const response = await axios.get(
          `http://api.weatherapi.com/v1/future.json?key=${process.env.WEATHERAPI_API_TOKEN}&q=${input.lat},${input.lon}&dt=${dateArray[0]}`
        );

        // console.log("Response: ", response.data);

        const cityName: string = response.data.location.name;
        const countryName: string = response.data.location.country;
        forecastArray.push({
          date: response.data.forecast.forecastday[0].date_epoch,
          temp_c: response.data.forecast.forecastday[0].day.avgtemp_c,
          temp_max_c: response.data.forecast.forecastday[0].day.maxtemp_c,
          temp_min_c: response.data.forecast.forecastday[0].day.mintemp_c,
          condition: response.data.forecast.forecastday[0].day.condition.text,
          conditionCode:
            response.data.forecast.forecastday[0].day.condition.code,
        });

        if (dateArray.length == 1) {
          return {
            cityName,
            countryName,
            forecastArray,
          };
        }

        for (let j = 1; j < dateArray.length; j++) {
          // Push a daily forecast here
          const response = await axios.get(
            `http://api.weatherapi.com/v1/future.json?key=${process.env.WEATHERAPI_API_TOKEN}&q=${input.lat},${input.lon}&dt=${dateArray[j]}`
          );

          forecastArray.push({
            date: response.data.forecast.forecastday[0].date_epoch,
            temp_max_c: response.data.forecast.forecastday[0].day.maxtemp_c,
            temp_min_c: response.data.forecast.forecastday[0].day.mintemp_c,
            temp_c: response.data.forecast.forecastday[0].day.avgtemp_c,
            condition: response.data.forecast.forecastday[0].day.condition.code,
          });
        }

        return {
          cityName,
          countryName,
          forecastArray,
        };
      } catch (error) {
        console.log("Error Fetching New Forecast", error);
      }
    },
  })
  .query("getWeatherWithFilter", {
    input: z.object({
      lat: z.number(),
      lon: z.number(),
      isHome: z.boolean(),
    }),
    async resolve({ input }) {
      // do Something
      if (!input.isHome) {
        // Filter
      }

      return;
    },
  });
