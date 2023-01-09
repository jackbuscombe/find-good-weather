import { createRouter } from "./context";
import { number, z } from "zod";
import axios from "axios";
import { CityResult } from "../../components/ResultsTable";

export const placesRouter = createRouter()
  .query("getPlaceRapid", {
    input: z.object({
      placeName: z.string(),
    }),
    async resolve({ input }) {
      const options = {
        method: "GET",
        url: "https://travel-advisor.p.rapidapi.com/locations/search",
        params: {
          query: input.placeName,
          limit: "2",
          offset: "0",
          units: "km",
          location_id: "1",
          currency: "USD",
          sort: "relevance",
          lang: "en_US",
        },
        headers: {
          "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY as string,
          "X-RapidAPI-Host": process.env
            .X_RAPIDAPI_HOST_TRAVEL_ADVISOR as string,
        },
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          return response.data;
        })
        .catch(function (error) {
          console.error(error);
          return;
        });
    },
  })
  .query("getPlaceBasicDetailsFromCityName", {
    input: z.object({
      cityName: z.string(),
    }),
    async resolve({ input }) {
      try {
        const place = await axios.get(
          `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
            input.cityName.trim()
          )}&inputtype=textquery&fields=place_id%2Cphoto&key=${
            process.env.GOOGLE_MAPS_API
          }`
        );
        const placeId = place.data.candidates[0].place_id;
        const mainPhotoRef = place.data.candidates[0].photos[0].photo_reference;
        let mainPhotoUrl = "";
        await axios
          .get(
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${mainPhotoRef}&key=${process.env.GOOGLE_MAPS_API}`
          )
          .then(function (response) {
            mainPhotoUrl = response.request.res.responseUrl;
          })
          .catch(function (error) {
            console.log("Error fetching basic city details", error);
          });
        return {
          placeId,
          mainPhotoUrl,
        };
      } catch (error) {
        console.log("Error fetching basic city details", error);
      }
    },
  })
  .query("getPlaceImagesFromCityName", {
    input: z.object({
      selectedCityName: z.string(),
    }),
    async resolve({ input }) {
      try {
        const placeSearch = await axios.get(
          `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
            input.selectedCityName.trim()
          )}&inputtype=textquery&fields=place_id%2Cphoto%2Cgeometry&key=${
            process.env.GOOGLE_MAPS_API
          }`
        );
        const placeId = placeSearch.data.candidates[0].place_id;
        const placeDetails = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name%2Cphoto&key=${process.env.GOOGLE_MAPS_API}`
        );
        const photosArray = placeDetails.data.result.photos;
        const photosReferenceArray = [];
        for (let i = 0; i < photosArray.length; i++) {
          photosReferenceArray.push(photosArray[i].photo_reference);
        }
        const photosUrlArray: string[] = [];
        for (
          let i = 0;
          i <
          (photosReferenceArray.length < 6 ? photosReferenceArray.length : 6);
          i++
        ) {
          await axios
            .get(
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photosReferenceArray[i]}&key=${process.env.GOOGLE_MAPS_API}`
            )
            .then(function (response) {
              photosUrlArray.push(response.request.res.responseUrl);
            })
            .catch(function (error) {
              console.log("Error fetching photo", error);
            });
        }
        return photosUrlArray;
      } catch (error) {
        console.log("Error fetching city photos", error);
      }
    },
  })
  .query("getPlaceDetailsFromCityId", {
    input: z.object({
      cityId: z.string(),
    }),
    async resolve({ input }) {
      try {
        const options = {
          method: "GET",
          url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${input.cityId}`,
          headers: {
            "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY as string,
            "X-RapidAPI-Host": process.env.X_RAPIDAPI_HOST_GEO_DB as string,
          },
        };

        const result = await axios.request(options);
        const cityDetails = {
          city: result.data.city,
          cityName: result.data.name,
          type: result.data.type,
          countryName: result.data.countryName,
          countryCode: result.data.countryCode,
          region: result.data.region,
          regionCode: result.data.regionCode,
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          population: result.data.population,
        };
        return cityDetails;
      } catch (error) {
        // console.log("Error fetching city details", error);
      }
    },
  })
  .query("getTravelTimeFromCityName", {
    input: z.object({
      // userLat: z.number(),
      // userLong: z.number(),
      // destinationLat: z.number(),
      // destinationLong: z.number(),
      originCityName: z.string(),
      destinationCityName: z.string(),
    }),
    async resolve({ input }) {
      try {
        const distanceSearch = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
            input.originCityName.trim()
          )}&destinations=${encodeURIComponent(
            input.destinationCityName.trim()
          )}&units=imperial&key=${process.env.GOOGLE_MAPS_API}`
        );
        return distanceSearch.data;
      } catch (error) {
        console.log("Error fetching travel time", error);
      }
    },
  })
  .query("getTravelTimeFromLatLong", {
    input: z.object({
      userLat: z.number(),
      userLong: z.number(),
      destinationLat: z.number(),
      destinationLong: z.number(),
    }),
    async resolve({ input }) {
      try {
        const distanceSearch = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${input.userLat}%2C${input.userLong}&destinations=${input.destinationLat}${input.destinationLong}&key=${process.env.GOOGLE_MAPS_API}`
        );
        console.log("The newest travel time is ", distanceSearch.data);
        return distanceSearch.data;
      } catch (error) {
        console.log("Error fetching travel time", error);
      }
    },
  })
  .query("getCityFromLatLong", {
    input: z.object({
      lat: z.number(),
      long: z.number(),
    }),
    async resolve({ input }) {
      try {
        const reverseGeocode = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?result_type=locality&latlng=${input.lat},${input.long}&key=${process.env.GOOGLE_MAPS_API}`
        );
        return {
          fullLocationName: reverseGeocode.data.results[0].formatted_address,
          cityName:
            reverseGeocode.data.results[0].address_components[0].long_name,
          countryName:
            reverseGeocode.data.results[0].address_components[
              reverseGeocode.data.results[0].address_components.length - 1
            ].long_name,
          placeId: reverseGeocode.data.results[0].place_id,
        };
      } catch (error) {
        console.log("Error fetching city", error);
      }
    },
  })
  .query("getNearbyCities", {
    input: z.object({
      isoCoords: z.string(),
    }),
    async resolve({ input }) {
      try {
        const options = {
          method: "GET",
          url: `https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${input.isoCoords}/nearbyCities`,
          params: {
            radius: "100",
            minPopulation: "90000",
            distanceUnit: "MI",
            types: "CITY",
          },
          headers: {
            "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY as string,
            "X-RapidAPI-Host": process.env.X_RAPIDAPI_HOST_GEO_DB as string,
          },
        };
        const result = await axios.request(options);
        const nearbyCitiesArray = [];
        for (let i = result.data.data.length - 1; i >= 0; i--) {
          nearbyCitiesArray.push({
            cityId: result.data.data[i].wikiDataId,
            cityName: result.data.data[i].name,
            countryName: result.data.data[i].country,
            distance: result.data.data[i].distance,
            lat: result.data.data[i].latitude,
            long: result.data.data[i].longitude,
            population: result.data.data[i].population,
            imageUrl: "https://google.com",
            flightTime: 600,
            transportTime: 800,
            driveTime: 700,
            weatherData: [10, 20, 50, 90],
            isUserHere: false,
          });
        }
        return nearbyCitiesArray;
      } catch (error) {
        // console.log("Error fetching nearby cities", error);
      }
    },
  })
  .query("getPlaceDetailsFromCityName", {
    input: z.object({
      selectedCityName: z.string(),
    }),
    async resolve({ input }) {
      try {
        const placeSearch = await axios.get(
          `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
            input.selectedCityName.trim()
          )}&inputtype=textquery&fields=place_id%2Cphoto%2Cgeometry&key=${
            process.env.GOOGLE_MAPS_API
          }`
        );
        const placeId = placeSearch.data.candidates[0].place_id;
        const placeDetails = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name%2Cphoto%2Caddress_component&key=${process.env.GOOGLE_MAPS_API}`
        );
        const countryName =
          placeDetails.data.result.address_components[
            placeDetails.data.result.address_components.length - 1
          ].long_name;
        return countryName;
        // const photosArray = placeDetails.data.result.photos;
        // const photosReferenceArray = [];
        // for (let i = 0; i < photosArray.length; i++) {
        // 	photosReferenceArray.push(photosArray[i].photo_reference);
        // }
        // const photosUrlArray: string[] = [];
        // for (let i = 0; i < (photosReferenceArray.length < 6 ? photosReferenceArray.length : 6); i++) {
        // 	await axios
        // 		.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photosReferenceArray[i]}&key=${process.env.GOOGLE_MAPS_API}`)
        // 		.then(function (response) {
        // 			photosUrlArray.push(response.request.res.responseUrl);
        // 		})
        // 		.catch(function (error) {
        // 			console.log("Error fetching photo", error);
        // 		});
        // }
      } catch (error) {
        console.log("Error fetching city photos", error);
      }
    },
  })
  .query("getClosePlaces", {
    input: z.object({
      lat: z.number(),
      long: z.number(),
    }),
    async resolve({ input }) {
      try {
        console.log("Getting places near: ", `${input.lat}, ${input.long}`);
        console.log("Got nearby places");
      } catch (error) {
        console.log("Failed to retrieve nearby places", error);
      }
    },
  })
  .query("getFarPlaces", {
    // input: z.object({
    // 	lat: z.number(),
    // 	long: z.number(),
    // }),
    async resolve({}) {
      try {
        console.log("Getting popular places from afar");
        const afarPlaces = [
          {
            cityName: "Bangkok",
            countryName: "Thailand",
            distance: 100000,
            lat: 13.7563,
            long: 100.5018,
            population: 0,
            imageUrl: "",
            flightTime: 0,
            transportTime: 0,
            driveTime: 0,
            weatherData: [],
            isUserHere: false,
            cityId: "1",
            isFarPlace: true,
          },
          {
            cityName: "New York",
            countryName: "United States of America",
            distance: 110000,
            lat: 40.7128,
            long: 74.006,
            population: 0,
            imageUrl: "",
            flightTime: 0,
            transportTime: 0,
            driveTime: 0,
            weatherData: [],
            isUserHere: false,
            cityId: "1",
            isFarPlace: true,
          },
          {
            cityName: "Amsterdam",
            countryName: "Netherlands",
            distance: 120000,
            lat: 52.3676,
            long: 4.9041,
            population: 0,
            imageUrl: "",
            flightTime: 0,
            transportTime: 0,
            driveTime: 0,
            weatherData: [],
            isUserHere: false,
            cityId: "1",
            isFarPlace: true,
          },
        ];
        // Do a check to make sure we are not giving nearby places
        return afarPlaces;
      } catch (error) {
        console.log("Failed to retrieve nearby places", error);
      }
    },
  });
