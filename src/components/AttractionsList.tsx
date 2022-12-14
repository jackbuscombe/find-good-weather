import { Ring } from "@uiball/loaders";
import { trpc } from "../utils/trpc";
import { useStore } from "./appStore";
import { useEffect } from "react";
import { BsStarFill } from "react-icons/bs";

type Props = {
	lat: number;
	long: number;
};

function AttractionsList({ lat, long }: Props) {
	const selectedCityLat = useStore((state) => state.selectedCityLat);
	const selectedCityLong = useStore((state) => state.selectedCityLong);

	const { data: attractions, isLoading } = trpc.useQuery(["attractions.getRestaurantsNearCoordinates", { lat, long }], {
		enabled: !!lat && !!long,
		staleTime: Infinity,
		cacheTime: Infinity,
	});

	useEffect(() => {
		if (!attractions) return;
		console.log("attractions list is", attractions);
	}, [attractions]);

	return (
		<div className="w-full flex flex-col space-y-12">
			{isLoading && (
				<div className="flex justify-center w-full py-4">
					<Ring />
				</div>
			)}
			{attractions &&
				attractions.length > 0 &&
				attractions.map(({ name, photo, placeId, rating, userRatingsTotal, vicinity, lat, long }) => (
					<div key={placeId} className="flex justify-between w-full bg-white rounded-lg shadow pr-8 hover:bg-gray-100 cursor-pointer transform transition ease-in-out">
						<div className="flex space-x-3">
							<img src={photo != "" ? photo : "/no-image-placeholder.jpg"} alt={name} className="h-32 w-32 object-cover" />
							<div className="pt-3">
								<h3 className="text-lg font-semibold">{name}</h3>
								{vicinity && <p className="text-gray-500 italic">{vicinity}</p>}
							</div>
						</div>
						<div className="pt-3">
							{rating > 0 && (
								<div className="flex items-center space-x-2">
									<span className="text-yellow-500">
										<BsStarFill />
									</span>
									<p className="font-bold">{rating} / 5</p>
								</div>
							)}
							{userRatingsTotal > 0 && <p>{userRatingsTotal} reviews</p>}
							<button className="bg-blue-500 text-white p-2 rounded mt-4 font-bold hover:bg-500">BOOK NOW</button>
						</div>
					</div>
				))}
			{!isLoading && attractions && attractions?.length === 0 && (
				<div className="flex justify-center w-full py-4">
					<p>No attractions were found...</p>
				</div>
			)}
		</div>
	);
}
export default AttractionsList;
