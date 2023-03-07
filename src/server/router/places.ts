import { createRouter } from "./context";
import { number, z } from "zod";
import axios from "axios";
import { connectToCluster } from "../db/client";
import { MongoClient } from "mongodb";
import { countryCodes } from "../../../public/countryCodes";
import { GeonameResponse, GeonameResult } from "../../types";
import secondsToDhm from "../../utils/secondsToDhm";

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
          // console.log(response.data);
          return response.data;
        })
        .catch(function (error) {
          // console.error(error);
          return;
        });
    },
  })
  .query("getPlaceImagefromCityName", {
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
          .then((response) => {
            // console.log("This is the response", response.request);
            mainPhotoUrl = response.request.res.responseUrl;
            // mainPhotoUrl = response;
          })
          .catch(function (error) {
            // console.log("Error fetching basic city details", error);
          });
        return mainPhotoUrl;
      } catch (error) {
        // console.log("Error fetching basic city details", error);
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
              // console.log("Error fetching photo", error);
            });
        }
        return photosUrlArray;
      } catch (error) {
        // console.log("Error fetching city photos", error);
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
        // console.log("Error fetching travel time", error);
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
        const driveTimeQuery = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${input.destinationLat}%2C${input.destinationLong}&origins=${input.userLat}%2C${input.userLong}&mode=driving&key=${process.env.GOOGLE_MAPS_API}`
        );
        const travelTimeDriving =
          secondsToDhm(
            driveTimeQuery.data.rows[0].elements[0].duration.value
          ) ?? "N/A";
        console.log("The newest Drive time is ", travelTimeDriving);

        const transitTimeQuery = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${input.destinationLat}%2C${input.destinationLong}&origins=${input.userLat}%2C${input.userLong}&mode=transit&key=${process.env.GOOGLE_MAPS_API}`
        );
        const travelTimeTransit =
          secondsToDhm(
            transitTimeQuery.data.rows[0].elements[0].duration.value
          ) ?? "N/A";
        console.log("The newest Transit time is ", travelTimeTransit);

        return { travelTimeDriving, travelTimeTransit };
      } catch (error) {
        throw new Error("Unable to get Travel Time");
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
        // console.log("Error fetching city", error);
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
        // console.log("Error fetching city photos", error);
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
        // console.log("Getting places near: ", `${input.lat}, ${input.long}`);
        // console.log("Got nearby places");
      } catch (error) {
        // console.log("Failed to retrieve nearby places", error);
      }
    },
  })
  .query("getFarPlaces", {
    async resolve({}) {
      try {
        const afarPlaces: GeonameResult[] = [
          {
            id: "1609350",
            name: "Bangkok",
            lat: 13.7563,
            lon: 100.5018,
            countryName: "Thailand",
            distance: 999999,
            isFarPlace: true,
          },
          {
            id: "5128581",
            name: "New York",
            countryName: "United States of America",
            lat: 40.7128,
            lon: -74.006,
            distance: 999999,
            isFarPlace: true,
          },
          {
            id: "2759794",
            name: "Amsterdam",
            countryName: "Netherlands",
            lat: 52.3676,
            lon: 4.9041,
            distance: 999999,
            isFarPlace: true,
          },
        ];
        // Do a check to make sure we are not giving nearby places
        return afarPlaces;
      } catch (error) {
        // console.log("Failed to retrieve nearby places", error);
      }
    },
  })
  .query("getWikiMediaImage", {
    input: z.object({
      wikiDataId: z.string(),
    }),
    async resolve({ input }) {
      try {
        // const wikiEndpoint = "https://simple.wikipedia.org/w/api.php";
        const wikiEndpoint = `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${input.wikiDataId}`;
        // const wikiParams =
        //   "?action=query" +
        //   "&prop=imageinfo" + // ab 'extract' is the type of property being request
        //   "&iiprop=url" +
        //   "&titles=" +
        //   input.wikiDataId + // tells the link which sepcific wikipedia page to get an extract from (changes based on the input param)
        //   "&format=json" + // requests the data in JSON format
        //   "&formatversion=2" + // makes the JSON properties easier to navigate using dot notation
        //   "&origin=*"; // omitting this param causes a CORS error

        const wikiParams = {
          action: "wbgetclaims",
          property: "P18",
          entity: input.wikiDataId,
          format: "json",
          formatversion: "2",
          origin: "*",
        };

        const fileNameRes = await axios
          .get(wikiEndpoint, { params: wikiParams, timeout: 6500 })
          .then((result) => {
            return result;
          });

        console.log(fileNameRes.request);

        const fileName =
          fileNameRes.data.claims.P18[0].mainsnak.datavalue.value;

        const imageUrlRes = await axios
          .get(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=300&titles=File:${fileName}`,
            { timeout: 6500 }
          )
          .then((result) => {
            return result;
          });

        const imageUrl = imageUrlRes.data.query.pages[-1].imageinfo[0].thumburl;

        return imageUrl;
      } catch (error) {
        console.log("Error fetching Wiki Image: ", error);
      }
    },
  })
  .query("getWikiMediaImageOld", {
    input: z.object({
      wikiDataId: z.string(),
    }),
    async resolve({ input }) {
      try {
        const wikiEndpoint = "https://simple.wikipedia.org/w/api.php";
        // const wikiParams =
        //   "?action=query" +
        //   "&prop=imageinfo" + // ab 'extract' is the type of property being request
        //   "&iiprop=url" +
        //   "&titles=" +
        //   input.wikiDataId + // tells the link which sepcific wikipedia page to get an extract from (changes based on the input param)
        //   "&format=json" + // requests the data in JSON format
        //   "&formatversion=2" + // makes the JSON properties easier to navigate using dot notation
        //   "&origin=*"; // omitting this param causes a CORS error

        const wikiParams = {
          action: "query",
          prop: "images",
          imlimit: 1,
          // iiprop: "url",
          titles: input.wikiDataId,
          format: "json",
          formatversion: "2",
          origin: "*",
        };

        // const wikiLink = wikiEndpoint + wikiParams;
        // console.log(wikiLink);

        // const wikiConfig = {
        //   timeout: 6500,
        // };

        const fileNameRes = await axios
          .get(wikiEndpoint, { params: wikiParams, timeout: 6500 })
          .then((result) => {
            return result;
          });
        // console.log(fileNameRes.data);

        const fileName = fileNameRes.data.query.pages[0].images[0].title;
        // console.log(
        //   `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=300&titles=${fileName}`
        // );

        const imageUrlRes = await axios
          .get(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=300&titles=${fileName}`,
            { timeout: 6500 }
          )
          .then((result) => {
            return result;
          });
        // console.log(imageUrlRes.data);

        const imageUrl = imageUrlRes.data.query.pages[-1].imageinfo[0].thumburl;
        console.log("Image URL: ", imageUrl);

        return imageUrl;
      } catch (error) {
        console.log("Error fetching Wiki Image: ", error);
      }
    },
  })
  .query("getWikiMediaImageNewest", {
    input: z.object({
      lat: z.string(),
      lon: z.string(),
      // wikiDataId: z.string(),
    }),
    async resolve({ input }) {
      try {
        // const wikiEndpoint = "https://simple.wikipedia.org/w/api.php";
        // const wikiEndpoint = `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${input.wikiDataId}`;
        // const wikiParams =
        //   "?action=query" +
        //   "&prop=imageinfo" + // ab 'extract' is the type of property being request
        //   "&iiprop=url" +
        //   "&titles=" +
        //   input.wikiDataId + // tells the link which sepcific wikipedia page to get an extract from (changes based on the input param)
        //   "&format=json" + // requests the data in JSON format
        //   "&formatversion=2" + // makes the JSON properties easier to navigate using dot notation
        //   "&origin=*"; // omitting this param causes a CORS error

        // const wikiParams = {
        //   action: "wbgetclaims",
        //   property: "P18",
        //   entity: input.wikiDataId,
        //   format: "json",
        //   formatversion: "2",
        //   origin: "*",
        // };

        const wikiEndpoint = `https://commons.wikimedia.org/w/api.php?format=json&action=query&list=geosearch&gsprimary=all&gsnamespace=6&gsradius=5000&gscoord=${input.lat}|${input.lon}`;
        console.log("url: ", wikiEndpoint);

        const fileNameRes = await axios
          .get(wikiEndpoint, { timeout: 6500 })
          .then((result) => {
            return result;
          });

        const fileName = fileNameRes.data.query.geosearch[0].title;
        console.log("Newest File Name: ", fileName);

        // Try this too
        // const imageUrlAlternative = await axios.get(`https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord=51.5|11.95&ggslimit=1&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200`)
        // const fileNameAlt = imageUrlAlternative.data.query.
        // End try this too

        // const fileName = fileNameRes.data.claims.P18[0].mainsnak.datavalue.value;

        const imageUrlRes = await axios
          .get(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=300&titles=${fileName}`,
            { timeout: 6500 }
          )
          .then((result) => {
            return result;
          });

        console.log(imageUrlRes.data);

        const imageUrl = imageUrlRes.data.query.pages[-1].imageinfo[0].thumburl;
        console.log("newest imageurl: ", imageUrl);

        return imageUrl;
      } catch (error) {
        console.log("Error fetching Wiki Image: ", error);
      }
    },
  })
  .query("getWikiMediaFromGeonamesId", {
    input: z.object({
      geoNamesId: z.number(),
    }),
    async resolve({ input }) {
      try {
        class SPARQLQueryDispatcher {
          endpoint: string;

          constructor(endpoint: string) {
            this.endpoint = endpoint;
          }

          query(sparqlQuery: string) {
            const fullUrl =
              this.endpoint + "?query=" + encodeURIComponent(sparqlQuery);
            const headers = { Accept: "application/sparql-results+json" };

            return fetch(fullUrl, { headers }).then((body) => body.json());
          }
        }

        const endpointUrl = "https://query.wikidata.org/sparql";
        const sparqlQuery = `SELECT DISTINCT ?item ?itemLabel ?imageLabel WHERE {
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
          {
            ?item p:P1566 ?statement0.
            ?statement0 (ps:P1566) "${input.geoNamesId}".
            OPTIONAL { ?item wdt:P18 ?image. }
          }
        }
        LIMIT 100`;

        const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
        const queryRes = await queryDispatcher.query(sparqlQuery);

        const wikidata = queryRes.results.bindings[0];
        const wikidataId = wikidata.itemLabel.value;
        // const placeName = wikidata.placeLabel;
        const imageUrl = wikidata.imageLabel.value;

        return imageUrl;
        // const wikiSparql = `https://query.wikidata.org/sparql?query=SELECT%20%3Fid%20%3FplaceLabel%20%3FimageLabel%0AWHERE%0A%7B%0A%20%20%3Fplace%20wdt%3AP6482%20%3Fid%20.%0A%20%20%3Fplace%20wdt%3AP1566%20%22${input.geoNamesId}%22%20.%0A%20%20%3Fplace%20wdt%3AP18%20%3Fimage%20.%0A%20%20%0ASERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cen%22%20%7D%0A%7D`;
        // console.log("url: ", wikiSparql);

        // const fileNameRes = await axios
        //   .get(wikiSparql, { timeout: 6500 })
        //   .then((result) => {
        //     return result;
        //   });

        // console.log("SPAQL Response: ", JSON.parse(fileNameRes.data));

        // FINISH HERE

        // const fileName = fileNameRes.data.query.geosearch[0].title;
        // console.log("Newest File Name: ", fileName);

        // Try this too
        // const imageUrlAlternative = await axios.get(`https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord=51.5|11.95&ggslimit=1&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200`)
        // const fileNameAlt = imageUrlAlternative.data.query.
        // End try this too

        // const fileName = fileNameRes.data.claims.P18[0].mainsnak.datavalue.value;

        // const imageUrlRes = await axios
        //   .get(
        //     `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=300&titles=${fileName}`,
        //     { timeout: 6500 }
        //   )
        //   .then((result) => {
        //     return result;
        //   });

        // console.log(imageUrlRes.data);

        // const imageUrl = imageUrlRes.data.query.pages[-1].imageinfo[0].thumburl;
        // console.log("newest imageurl: ", imageUrl);

        // return imageUrl;
      } catch (error) {
        // console.log("Error fetching Wiki Image: ", error);
      }
    },
  })
  .query("getNearbyPlacesMongo", {
    input: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
    async resolve({ input }) {
      try {
        // const client = await clientPromise;
        // const client = await MongoClient.connect(
        //   process.env.MONGODB_URL as string
        // );
        // const client = await mongo?.connect();

        const client = await connectToCluster();

        const filter = {
          location: {
            $near: {
              $minDistance: 100000, // 100 km
              $maxDistance: 10000000, // 10,000 km
              $geometry: {
                type: "Point",
                coordinates: [input.lon, input.lat],
              },
            },
          },
        };

        const aggregation = [
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [input.lon, input.lat],
              },
              minDistance: 100 * 1000,
              maxDistance: 50000 * 1000,
              key: "location",
              spherical: true,
              distanceField: "distance",
            },
          },
        ];

        const geoNames = client
          ?.db("geonames")
          .collection("geonames_pop_100000");
        const response = (await geoNames
          .aggregate(aggregation)
          .limit(30)
          .toArray()) as GeonameResponse[];

        const result: GeonameResult[] = [];

        for (let i = 0; i < response.length; i++) {
          result.push({
            name: response[i]?.name ?? "",
            countryName: countryCodes[response[i]?.countryCode ?? "AU"],
            id: response[i]?.id ?? "1",
            lat: response[i]?.location.coordinates[1] ?? 0,
            lon: response[i]?.location.coordinates[0] ?? 0,
            distance: 100,
            isFarPlace: false,
          });
        }
        return result;
      } catch (error) {
        console.log(error);
        throw new Error("Unable to get GeoNames");
      }
    },
  });
