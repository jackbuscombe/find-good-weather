import { createRouter } from "./context";
import { z } from "zod";
import axios from "axios";
import { largeAirports } from "../../../public/largeAirports";
import { mediumAirports } from "../../../public/mediumAirports";

export const flightsRouter = createRouter()
  .query("getForecast", {
    input: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
    async resolve({ input }) {
      try {
        const options = {
          method: "GET",
          url: "https://travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com/v1/prices/cheap",
          params: {
            origin: "HKT",
            page: "None",
            currency: "RUB",
            destination: "-",
          },
          headers: {
            "X-Access-Token": process.env.TRAVEL_PAYOUTS_API_TOKEN as string,
            "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY as string,
            "X-RapidAPI-Host": process.env
              .X_RAPIDAPI_HOST_TRAVEL_PAYOUTS as string,
          },
        };

        const response = await axios.request(options);
        return response;
      } catch (error) {
        console.log("Error Fetching Forecast", error);
        return error;
      }
    },
  })
  .query("getIataCode", {
    input: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
    async resolve({ input }) {
      try {
        let iataCode = "";
        const options = {
          method: "GET",
          url: "https://aviation-reference-data.p.rapidapi.com/airports/search",
          params: { lat: input.lat, lon: input.lon, radius: "100" },
          headers: {
            "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY as string,
            "X-RapidAPI-Host": process.env
              .X_RAPIDAPI_AVIATION_REFERENCE as string,
          },
        };

        console.log("Input lat: ", input.lat);
        console.log("Input long: ", input.lon);

        const response = await axios.request(options);

        for (let i = 0; i < response.data.length; i++) {
          if (largeAirports.includes(response.data[i].iataCode)) {
            iataCode = response.data[i].iataCode;
            console.log("Returning from large airports: ", iataCode);
            return iataCode;
          }
        }

        for (let i = 0; i < response.data.length; i++) {
          if (mediumAirports.includes(response.data[i].iataCode)) {
            iataCode = response.data[i].iataCode;
            console.log("Returning from medium airports: ", iataCode);
            return iataCode;
          }
        }

        // .then(function (response) {
        //   console.log(iataCode);
        // });
        return iataCode;
      } catch (error) {
        console.error("Error getting nearest IATA Code: ", error);
      }
    },
  });
