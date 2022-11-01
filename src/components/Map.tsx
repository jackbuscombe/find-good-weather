import React, { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useStore } from "./appStore";

function Map() {
	const userLat = useStore((state) => state.userLat);
	const userLong = useStore((state) => state.userLong);

	const [libraries] = useState<("places" | "drawing" | "geometry" | "localContext" | "visualization")[]>(["places"]);
	const { isLoaded } = useJsApiLoader({
		libraries,
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
	});

	const [map, setMap] = React.useState(null);

	const center = {
		lat: userLat,
		lng: userLong,
	};

	const onLoad = React.useCallback(function callback(map: any) {
		const bounds = new window.google.maps.LatLngBounds(center);
		map.fitBounds(bounds);
		setMap(map);
	}, []);

	const onUnmount = React.useCallback(function callback(map: any) {
		setMap(null);
	}, []);

	return isLoaded && window ? (
		<GoogleMap mapContainerStyle={{ width: window?.innerWidth, height: window?.innerHeight }} center={center} zoom={8} onLoad={onLoad} onUnmount={onUnmount}>
			{/* Child components, such as markers, info windows, etc. */}
			<Marker
				position={{
					lat: userLat,
					lng: userLong,
				}}
				label="You are here"
			/>
			<></>
		</GoogleMap>
	) : (
		<>
			<p>Loading Map</p>
		</>
	);
}

export default React.memo(Map);
