import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Modal } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useStore } from "./appStore";
import {
  RiUserLocationLine,
  RiPlaneLine,
  RiTrainFill,
  RiCarFill,
  RiCloseLine,
} from "react-icons/ri";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SearchFormField from "./SearchFormField";
import { AiOutlineCalendar } from "react-icons/ai";
import { DateRangePicker } from "react-date-range";
import { useRef, useState, useEffect } from "react";
import WeatherCell from "./WeatherCell";
import { trpc } from "../utils/trpc";
import { Ring } from "@uiball/loaders";
import AccommodationList from "./AccommodationList";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import RestaurantsList from "./RestaurantsList";
import AttractionsList from "./AttractionsList";
import { add, format } from "date-fns";
import { BiChevronDown, BiUser } from "react-icons/bi";
import SearchFieldPeople from "./SearchFields/SearchFieldPeople";

function LocationModalOld() {
  const selectedCityName = useStore((state) => state.selectedCityName);
  const selectedCountryName = useStore((state) => state.selectedCountryName);
  const isLocationModalOpen = useStore((state) => state.isLocationModalOpen);
  const setIsLocationModalOpen = useStore(
    (state) => state.setIsLocationModalOpen
  );
  const selectedLocationId = useStore((state) => state.selectedLocationId);
  const selectedCityFlightTime = useStore(
    (state) => state.selectedCityFlightTime
  );
  const selectedCityTransportTime = useStore(
    (state) => state.selectedCityTransportTime
  );
  const selectedCityDriveTime = useStore(
    (state) => state.selectedCityDriveTime
  );
  const selectedCityWeatherData = useStore(
    (state) => state.selectedCityWeatherData
  );

  const selectedCityLat = useStore((state) => state.selectedCityLat);
  const selectedCityLong = useStore((state) => state.selectedCityLong);

  const datepickerWrapperRef = useRef(null);
  // useOutsideAlerter(datepickerWrapperRef);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isDatepickerOpen, setIsDatepickerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("attractions");

  const { data: cityImages, isLoading } = trpc.useQuery(
    [
      "places.getPlaceImagesFromCityName",
      { selectedCityName: selectedCityName },
    ],
    {
      enabled: !!selectedCityName,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const handleSelect = (ranges: any) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(add(ranges.selection.startDate, { days: 13 }));
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsDatepickerOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <>
      <Modal
        centered
        withCloseButton={false}
        opened={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        overlayOpacity={0.55}
        overlayBlur={3}
        size="75%"
        padding={0}
        overflow="inside"
        transition="fade"
        transitionDuration={600}
        transitionTimingFunction="ease"
      >
        <div>
          {isLoading ? (
            <div className="w-full flex justify-center py-4">
              <Ring />
            </div>
          ) : (
            <Carousel
              withIndicators
              height={200}
              slideSize="33.333333%"
              nextControlIcon={
                <div className="bg-white rounded-full p-1">
                  <GrLinkNext size={16} />
                </div>
              }
              previousControlIcon={
                <div className="bg-white rounded-full p-1">
                  <GrLinkPrevious size={16} />
                </div>
              }
              breakpoints={[
                { maxWidth: "md", slideSize: "50%" },
                { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
              ]}
              loop
              align="start"
            >
              <Carousel.Slide>
                {cityImages && (
                  <img
                    src={cityImages[0]}
                    className="h-full w-full object-cover"
                  />
                )}
              </Carousel.Slide>
              <Carousel.Slide>
                {cityImages && (
                  <img
                    src={cityImages[1]}
                    className="h-full w-full object-cover"
                  />
                )}
              </Carousel.Slide>
              <Carousel.Slide>
                {cityImages && (
                  <img
                    src={cityImages[2]}
                    className="h-full w-full object-cover"
                  />
                )}
              </Carousel.Slide>
              <Carousel.Slide>
                {cityImages && (
                  <img
                    src={cityImages[3]}
                    className="h-full w-full object-cover"
                  />
                )}
              </Carousel.Slide>
              <Carousel.Slide>
                {cityImages && (
                  <img
                    src={cityImages[4]}
                    className="h-full w-full object-cover"
                  />
                )}
              </Carousel.Slide>
              <Carousel.Slide>
                {cityImages && (
                  <img
                    src={cityImages[5]}
                    className="h-full w-full object-cover"
                  />
                )}
              </Carousel.Slide>
            </Carousel>
          )}
        </div>
        <div className="flex flex-col bg-white p-8">
          <div className="flex items-center justify-between p-4 whitespace-nowrap">
            <div className="w-full flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-black font-mono">
                  {selectedCityName}
                </h2>
                <p className="text-gray-500">{selectedCountryName}</p>
              </div>
              <div className="flex space-x-6 text-xl">
                {/* <div className="flex items-center space-x-2">
									<RiPlaneLine />
									<p className="text-gray-500 text-base">800</p>
								</div>
								<div className="flex items-center space-x-2">
									<RiTrainFill />
									<p className="text-gray-500 text-base">600</p>
								</div> */}
                {selectedCityDriveTime != "" && (
                  <div className="flex items-center space-x-2">
                    <RiCarFill />
                    <p className="text-gray-500 text-base">
                      {selectedCityDriveTime}
                    </p>
                  </div>
                )}
                <div
                  onClick={() => setIsLocationModalOpen(false)}
                  className={`text-gray-500 bg-gray-100 hover:bg-gray-200 text-lg p-4 cursor-pointer`}
                >
                  <RiCloseLine />
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4" ref={datepickerWrapperRef}>
            <SearchFormField
              title="People"
              icon={
                <BiUser className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />
              }
            >
              <SearchFieldPeople
                options={[
                  {
                    value: 1,
                    label: "1 Adult",
                  },
                  {
                    value: 2,
                    label: "2 Adults",
                  },
                  {
                    value: 3,
                    label: "3 Adults",
                  },
                  {
                    value: 4,
                    label: "4 Adults",
                  },
                  {
                    value: 5,
                    label: "5 Adults",
                  },
                  {
                    value: 6,
                    label: "6 Adults",
                  },
                ]}
              />
            </SearchFormField>
            <SearchFormField
              title="When"
              icon={
                <AiOutlineCalendar className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />
              }
            >
              <>
                <div
                  className="flex justify-between items-center font-mono"
                  onClick={() => setIsDatepickerOpen(true)}
                >
                  <input
                    placeholder={`${format(startDate, "dd MMM yy")} - ${format(
                      endDate,
                      "dd MMM yy"
                    )}`}
                    className="border-none outline-none bg-transparent flex-grow text-black font-bold placeholder-black text-lg cursor-pointer"
                    type="text"
                  />
                  <BiChevronDown
                    className="h-5 w-5 text-gray-400 ml-2"
                    aria-hidden="true"
                  />
                </div>
                {isDatepickerOpen && (
                  <div className="absolute bg-white font-sans mx-auto mt-2 z-40 overflow-y-scroll -bottom-10">
                    <DateRangePicker
                      ranges={[selectionRange]}
                      minDate={new Date()}
                      rangeColors={["#253adc"]}
                      onChange={handleSelect}
                      moveRangeOnFirstSelection={true}
                      retainEndDateOnFirstSelection={true}
                    />
                    <div className="flex space-x-3 justify-center py-3">
                      <button
                        onClick={() => setIsDatepickerOpen(false)}
                        className="bg-transparent border text-gray-500 font-semibold p-3 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setIsDatepickerOpen(false)}
                        className="bg-blue-500 text-white font-semibold p-3 rounded"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </>
            </SearchFormField>
          </div>

          {selectedCityWeatherData.length > 0 && (
            <div className="flex w-full justify-center space-x-4">
              <div className="flex items-center bg-gray-100 shadow rounded p-2 my-2 cursor-pointer hover:bg-gray-200">
                <FiChevronLeft />
              </div>
              {selectedCityWeatherData.map(
                ({ day, date, low, high, text }, i) => (
                  <WeatherCell
                    key={i}
                    day={day}
                    date={date}
                    low={low}
                    high={high}
                    text={text}
                  />
                )
              )}
              <div className="flex items-center bg-gray-100 shadow rounded p-2 my-2 cursor-pointer hover:bg-gray-200">
                <FiChevronRight />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-8 bg-gray-50 py-8 px-4">
          <div className="flex space-x-6 font-mono font-bold text-lg">
            <button
              onClick={() => setSelectedTab("attractions")}
              className={`p-3 shadow rounded-lg ${
                selectedTab === "attractions"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              THINGS TO DO
            </button>
            <button
              onClick={() => setSelectedTab("accommodation")}
              className={`p-3 shadow rounded-lg ${
                selectedTab === "accommodation"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              ACCOMMODATION
            </button>
            <button
              onClick={() => setSelectedTab("restaurants")}
              className={`p-3 shadow rounded-lg ${
                selectedTab === "restaurants"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              RESTAURANTS
            </button>
            {/* <button onClick={() => setSelectedTab("flights")} className={`p-3 shadow rounded-lg ${selectedTab === "flights" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-white text-gray-500 hover:bg-gray-100"}`}>
							FLIGHTS
						</button>
						<button onClick={() => setSelectedTab("trains")} className={`p-3 shadow rounded-lg ${selectedTab === "trains" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-white text-gray-500 hover:bg-gray-100"}`}>
							TRAINS
						</button> */}
          </div>

          {selectedTab === "attractions" ? (
            <AttractionsList lat={selectedCityLat} long={selectedCityLong} />
          ) : selectedTab === "accommodation" ? (
            <AccommodationList lat={selectedCityLat} long={selectedCityLong} />
          ) : selectedTab === "restaurants" ? (
            <RestaurantsList lat={selectedCityLat} long={selectedCityLong} />
          ) : (
            <div>
              <p>Select a tab</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
export default LocationModalOld;
