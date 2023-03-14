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

  const { data: attractions, isLoading } = trpc.useQuery(
    ["attractions.getRestaurantsNearCoordinates", { lat, long }],
    {
      enabled: !!lat && !!long,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  return (
    <div className="w-full flex flex-col space-y-2">
      {isLoading && (
        <div className="flex justify-center w-full py-4">
          <Ring />
        </div>
      )}
      {attractions &&
        attractions.length > 0 &&
        attractions.map(
          ({
            name,
            photo,
            placeId,
            rating,
            userRatingsTotal,
            vicinity,
            lat,
            long,
            editorialSummary,
          }) => (
            <div
              key={placeId}
              className="flex flex-col sm:flex-row sm:justify-between w-full bg-white rounded-lg shadow p-4 hover:bg-gray-100 cursor-pointer transform transition ease-in-out"
            >
              <div className="flex flex-col sm:flex-row sm:space-x-5">
                <img
                  src={photo != "" ? photo : "/no-image-placeholder.jpg"}
                  alt={name}
                  className="w-full h-32 sm:w-32 object-cover rounded-lg mb-3 sm:mb-0"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{name}</h3>
                    {vicinity && (
                      <p className="text-gray-500">
                        {editorialSummary || vicinity}
                      </p>
                    )}
                  </div>
                  <div className="my-4">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${lat}%2C${long}&query_place_id=${placeId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition ease-in-out font-bold"
                    >
                      SHOW ON THE MAP
                    </a>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col space-y-4 pt-3">
                {rating > 0 && (
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">
                        <BsStarFill />
                      </span>
                      <p className="font-bold">{rating} / 5</p>
                    </div>
                    {userRatingsTotal > 0 && <p>{userRatingsTotal} reviews</p>}
                  </div>
                )}
                <div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${lat}%2C${long}&query_place_id=${placeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-500 text-white p-3 rounded mt-4 font-bold hover:bg-500"
                  >
                    BOOK NOW
                  </a>
                </div>
              </div>
            </div>
          )
        )}
      {!isLoading && attractions && attractions?.length === 0 && (
        <div className="flex justify-center w-full py-4">
          <p>No attractions were found...</p>
        </div>
      )}
    </div>
  );
}
export default AttractionsList;
