import { Ring } from "@uiball/loaders";
import { add, format } from "date-fns";

import { useEffect } from "react";
import { BiTransferAlt } from "react-icons/bi";
import { BsStarFill } from "react-icons/bs";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import secondsToDhm from "../../utils/secondsToDhm";
import { trpc } from "../../utils/trpc";
import { useStore } from "../appStore";

type Props = {
  lat: number;
  long: number;
};

export default function FlightsList({ lat, long }: Props) {
  const currentAirportIata = useStore((state) => state.currentAirportIata);
  const selectedAirportIata = useStore((state) => state.selectedAirportIata);
  const userCurrency = useStore((state) => state.userCurrency);
  const startDate = useStore((state) => state.startDate);
  const endDate = useStore((state) => state.endDate);
  const userCity = useStore((state) => state.userCity);
  const selectedCityName = useStore((state) => state.selectedCityName);

  const { data: flights, isLoading } = trpc.useQuery(
    [
      "flights.getFlights",
      {
        originIata: currentAirportIata,
        destinationIata: selectedAirportIata ?? "",
        currency: userCurrency,
        isOneWay: true,
        departureDate: format(add(startDate, { days: 2 }), "yyyy-MM-dd"),
        returnData: format(add(startDate, { days: 6 }), "yyyy-MM-dd"),
      },
    ],
    {
      enabled:
        !!currentAirportIata &&
        !!selectedAirportIata &&
        !!userCurrency &&
        !!startDate,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  useEffect(() => {
    if (!flights) return;
    console.log("flights list is", flights);
  }, [flights]);

  return (
    <div className="w-full flex flex-col space-y-2">
      {isLoading && (
        <div className="flex justify-center w-full py-4">
          <Ring />
        </div>
      )}
      {flights &&
        flights.length > 0 &&
        flights.map(
          (
            {
              value,
              trip_class,
              show_to_affiliates,
              origin,
              destination,
              gate,
              depart_date,
              return_date,
              number_of_changes,
              found_at,
              duration,
              distance,
              actual,
            },
            i
          ) => (
            <div
              key={i}
              className="flex flex-col space-y-5 w-full bg-white rounded-lg shadow p-6 hover:bg-gray-100 cursor-pointer transform transition ease-in-out"
            >
              {/* Row 1 */}
              <div className="flex items-center space-x-5">
                <img
                  src={
                    "https://1000logos.net/wp-content/uploads/2017/05/Qantas-Logo-500x315.png"
                  }
                  alt={"Qantas"}
                  className="h-8 w-8 bg-gray-200 object-cover rounded-full"
                />
                <p className="font-bold text-xl">Qantas</p>
              </div>

              {/* Row 2 */}
              <div className="flex justify-between items-center">
                <div className="text-gray-500 text-lg">
                  <p className="text-2xl text-black font-bold">11:15</p>
                  <p>{userCity}</p>
                  <p>{format(new Date(depart_date), "dd MMM, eee")}</p>
                </div>
                <div className="w-3/5 space-y-3 text-gray-400 text-lg">
                  <div className="flex justify-between">
                    <FaPlaneDeparture />
                    <p>
                      On the way: {secondsToDhm(duration * 60)}{" "}
                      {number_of_changes > 0 &&
                        `- ${number_of_changes} layovers`}
                    </p>
                    <FaPlaneArrival />
                  </div>
                  <div className="text-3xl">
                    {number_of_changes == 0 ? (
                      <hr className="border-4 border-gray-300" />
                    ) : number_of_changes == 1 ? (
                      <div className="flex space-x-2 items-center">
                        <hr className="w-1/2 border-4 border-gray-300" />
                        <BiTransferAlt />
                        <hr className="w-1/2 border-4 border-gray-300" />
                      </div>
                    ) : number_of_changes == 2 ? (
                      <div className="flex space-x-2 items-center">
                        <hr className="w-1/3 border-4 border-gray-300" />
                        <BiTransferAlt />
                        <hr className="w-1/3 border-4 border-gray-300" />
                        <BiTransferAlt />
                        <hr className="w-1/3 border-4 border-gray-300" />
                      </div>
                    ) : number_of_changes == 3 ? (
                      <div className="flex space-x-2 items-center">
                        <hr className="w-1/4 border-4 border-gray-300" />
                        <BiTransferAlt />
                        <hr className="w-1/4 border-4 border-gray-300" />
                        <BiTransferAlt />
                        <hr className="w-1/4 border-4 border-gray-300" />
                        <BiTransferAlt />
                        <hr className="w-1/4 border-4 border-gray-300" />
                      </div>
                    ) : number_of_changes == 4 ? (
                      <div className="flex space-x-2 items-center">
                        <hr className="w-1/5 border-4 border-gray-300" />
                        <BiTransferAlt />
                        <hr className="w-1/5 border-4 border-gray-300" />
                        <BiTransferAlt />
                        <hr className="w-1/5 border-4 border-gray-300" />
                        <BiTransferAlt />
                        <hr className="w-1/5 border-4 border-gray-300" />
                        <BiTransferAlt />
                        <hr className="w-1/5 border-4 border-gray-300" />
                      </div>
                    ) : (
                      <hr className="border-4 border-gray-300" />
                    )}
                  </div>
                  <div className="flex justify-between text-gray-500 font-bold">
                    <p>{origin}</p>
                    <p>{destination}</p>
                  </div>
                </div>
                <div className="text-gray-500 text-lg">
                  <p className="text-2xl text-black font-bold">13:55</p>
                  <p>{selectedCityName}</p>
                  <p>{format(new Date(depart_date), "dd MMM, eee")}</p>
                </div>
              </div>

              <hr />

              {/* Row 3 */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Price:</p>
                  <p className="text-xl text-blue-500 font-bold">
                    from ${value}
                  </p>
                </div>
                <div>
                  <a
                    href={"https://google.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-500 text-white p-3 rounded-lg mt-4 font-bold hover:bg-500"
                  >
                    BUY A TICKET
                  </a>
                </div>
              </div>
            </div>
          )
        )}
      {!isLoading && flights && flights?.length === 0 && (
        <div className="flex justify-center w-full py-4">
          <p>No flights were found...</p>
        </div>
      )}
    </div>
  );
}
