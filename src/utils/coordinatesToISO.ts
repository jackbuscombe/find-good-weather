export default function coordinatesToISO(lat: number, long: number) {
	const newLat = lat < 0 ? `${lat.toString()}` : `+${lat.toString()}`;
	const newLong = long < 0 ? `${long.toString()}` : `+${long.toString()}`;
	return `${newLat}${newLong}`;
}
