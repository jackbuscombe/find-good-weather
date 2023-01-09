# Find Good Weather

This is a beta version of Find Good Weather

######################
| THERE WILL BE BUGS |
######################

# Processes

## index.tsx (Page)

Process is from index -> User Lat and Long is fetched, which then fetches `nearbyCities`, and also `farCities` (dummy) which return an object with:

```
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
```

## ResultsTable (component)

This data is aggregated and passed into ResultsTable, which retains and maps the aggregated data into separate Results taking in the following data:

```
key={cityName}
cityId={cityId}
cityName={cityName}
distance={distance}
latitude={lat}
longitude={long}
countryName={countryName}
isUserHere
isFarPlace={isFarPlace}
```

## CityResult (component)

#### Getting the Photo

The CityResult component fetches the `places.getPlaceBasicDetailsFromCityName` with the `cityName` props as an input => this returns the google `placeId` and a `mainPhotoUrl` to show on the result

#### Getting the travel time

The CityResult component also uses the places.getTravelTimeFromCityName endpoint, passing in the following input:

```
destinationCityName: `${cityName} ${countryName}`,
originCityName: `${userCity}`,
```

This then returns the drivetime from the users location city name to the name of the destination

#### Getting the country name

The CityResult component also fetches from the places.getPlaceDetailsFromCityName endpoint, passing in the cityName from the prop
`selectedCityName: cityName`
... This returns the countryName

#### Getting the forecast

The CityResult component also fetches from the forecast.getYahooForecastByLatLong endpoint, passing in the latitude, longitude props as inputs, and returns and array of `YahooWeatherObject[]`

```
YahooWeatherObject = {
day: string;
date: number;
low: number;
high: number;
text: string;
}[]
```

The array of YahooWeatherObject is used to populate the WeatherCell's on each result.
