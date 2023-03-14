import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import { Carousel } from "@mantine/carousel";
import { Fragment, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import {
  RiCarFill,
  RiCarLine,
  RiCloseLine,
  RiPlaneLine,
  RiTrainFill,
  RiTrainLine,
} from "react-icons/ri";
import { trpc } from "../utils/trpc";
import { useStore } from "./appStore";
import WeatherCellNew from "./WeatherCellNew";
import AttractionsList from "./AttractionsList";
import AccommodationList from "./AccommodationList";
import RestaurantsList from "./RestaurantsList";
import { Ring } from "@uiball/loaders";
import SearchFormField from "./SearchFormField";
import { AiOutlineCalendar } from "react-icons/ai";
import { add, format } from "date-fns";
import { BiChevronDown, BiUser } from "react-icons/bi";
import SearchFieldPeople from "./SearchFields/SearchFieldPeople";
import { DateRange, DateRangePicker } from "react-date-range";
import FlightsList from "./ModalComponents/FlightsList";
import TrainsList from "./ModalComponents/TrainsList";

export default function LocationModal() {
  const isLocationModalOpen = useStore((state) => state.isLocationModalOpen);
  const setIsLocationModalOpen = useStore(
    (state) => state.setIsLocationModalOpen
  );
  const id = useStore((state) => state.selectedCityGeonameId);
  const lat = useStore((state) => state.selectedCityLat);
  const long = useStore((state) => state.selectedCityLong);
  const selectedCityName = useStore((state) => state.selectedCityName);
  const selectedCountryName = useStore((state) => state.selectedCountryName);
  const userLat = useStore((state) => state.userLat);
  const userLong = useStore((state) => state.userLong);
  const selectedCityLat = useStore((state) => state.selectedCityLat);
  const selectedCityLong = useStore((state) => state.selectedCityLong);
  const selectedCityWeatherData = useStore(
    (state) => state.selectedCityWeatherData
  );
  const selectedCityDriveTime = useStore(
    (state) => state.selectedCityDriveTime
  );
  const selectedCityTransitTime = useStore(
    (state) => state.selectedCityTransitTime
  );
  const selectedCityFlightTime = useStore(
    (state) => state.selectedCityFlightTime
  );
  const selectedCityFlightLink = useStore(
    (state) => state.selectedCityFlightLink
  );
  const startDate = useStore((state) => state.startDate);
  const endDate = useStore((state) => state.endDate);
  const setStartDate = useStore((state) => state.setStartDate);
  const setEndDate = useStore((state) => state.setEndDate);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const datepickerWrapperRef = useRef(null);
  const [isDatepickerOpen, setIsDatepickerOpen] = useState(false);

  // MOCK DATA
  const [categories] = useState({
    "THINGS TO DO": <AttractionsList lat={lat} long={long} />,
    FLIGHTS: <FlightsList lat={lat} long={long} />,
    TRAINS: <TrainsList lat={lat} long={long} />,
    ACCOMMODATION: <AccommodationList lat={lat} long={long} />,
    RESTAURANTS: <RestaurantsList lat={lat} long={long} />,
    // REVIEWS: <AccommodationList lat={lat} long={long} />,
    // INSTAGRAM: <RestaurantsList lat={lat} long={long} />,
    // "TIK TOK": <RestaurantsList lat={lat} long={long} />,
  });
  // MOCK DATA END

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handleSelect = (ranges: any) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(add(ranges.selection.startDate, { days: 13 }));
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

  const { data: imagesArray, isLoading: isLoadingImagesArray } = trpc.useQuery(
    [
      "places.getWikiMediaModalImagesFromGeonamesId",
      { geoNamesId: parseInt(id) },
    ],
    {
      enabled: isLocationModalOpen === true && !!id,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  useEffect(() => {
    if (!imagesArray) return;
    console.log("ImagesArray: ", imagesArray);
  }, [imagesArray]);

  return (
    <>
      <Transition appear show={isLocationModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          onClose={() => setIsLocationModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-7xl max-h-[90vh] overflow-auto transform rounded-2xl bg-gray-100 text-left align-middle shadow-xl transition-all font-mono">
                  {isLoadingImagesArray ? (
                    <div className="w-full flex justify-center items-center py-12">
                      <Ring />
                    </div>
                  ) : imagesArray && imagesArray.length > 0 ? (
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
                      {imagesArray?.map((image, i) => (
                        <Carousel.Slide key={i}>
                          <img
                            src={image}
                            className="h-full w-full object-cover"
                          />
                        </Carousel.Slide>
                      ))}
                    </Carousel>
                  ) : null}
                  {/* <Carousel.Slide>
                      <img
                        src={`https://lp-cms-production.imgix.net/2021-06/GettyRF_543739496.jpg?auto=format&q=75&w=1024`}
                        className="h-full w-full object-cover"
                      />
                    </Carousel.Slide>
                    <Carousel.Slide>
                      <img
                        src={`https://lp-cms-production.imgix.net/2021-06/shutterstockRF_163531187.jpg?auto=format&q=75&w=1024`}
                        className="h-full w-full object-cover"
                      />
                    </Carousel.Slide>
                    <Carousel.Slide>
                      <img
                        src={`https://lp-cms-production.imgix.net/2021-04/GettyRF_560123343.jpg?auto=format&q=75&w=1024`}
                        className="h-full w-full object-cover"
                      />
                    </Carousel.Slide>
                    <Carousel.Slide>
                      <img
                        src={`https://lp-cms-production.imgix.net/2021-05/shutterstockRF_691687414.jpg?auto=format&q=75&w=1024`}
                        className="h-full w-full object-cover"
                      />
                    </Carousel.Slide> */}
                  <div className="w-full p-6 bg-white">
                    {/* Row 1 */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                      <div className="flex justify-between">
                        <div>
                          <Dialog.Title
                            as="h3"
                            className="text-3xl text-gray-900 font-extrabold"
                          >
                            {selectedCityName}
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-gray-500">
                              {selectedCountryName}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsLocationModalOpen(false)}
                          className={`lg:hidden h-12 text-gray-500 bg-gray-100 hover:bg-gray-200 text-lg p-4 cursor-pointer`}
                        >
                          <RiCloseLine />
                        </button>
                      </div>
                      {/* Transport and Close Button */}
                      <div className="flex justify-between lg:space-x-6 text-xl my-4 lg:my-0">
                        <div className="w-full flex flex-col lg:flex-row justify-center lg:justify-start items-center text-center lg:space-x-4 py-2 hover:text-blue-500 group hover:underline space-y-2 lg:space-y-0">
                          <RiPlaneLine />
                          <a
                            href={selectedCityFlightLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-500 group-hover:text-blue-500 outline-none lg:whitespace-nowrap"
                          >
                            {selectedCityFlightTime}
                          </a>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row justify-center lg:justify-start items-center text-center lg:space-x-4 py-2 hover:text-blue-500 group hover:underline space-y-2 lg:space-y-0">
                          <RiTrainLine />
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLong}&destination=${selectedCityLat},${selectedCityLong}&travelmode=transit`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-500 group-hover:text-blue-500 outline-none lg:whitespace-nowrap"
                          >
                            {selectedCityTransitTime}
                          </a>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row justify-center lg:justify-start items-center text-center lg:space-x-4 py-2 hover:text-blue-500 group hover:underline space-y-2 lg:space-y-0">
                          <RiCarLine />
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLong}&destination=${selectedCityLat},${selectedCityLong}&travelmode=driving`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-500 group-hover:text-blue-500 outline-none lg:whitespace-nowrap"
                          >
                            {selectedCityDriveTime}
                          </a>
                        </div>
                        <button
                          onClick={() => setIsLocationModalOpen(false)}
                          className={`hidden lg:flex text-gray-500 bg-gray-100 hover:bg-gray-200 text-lg p-4 cursor-pointer`}
                        >
                          <RiCloseLine />
                        </button>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div
                      className="w-full flex my-5 overflow-hidden"
                      ref={datepickerWrapperRef}
                    >
                      <SearchFormField
                        title="When"
                        icon={
                          <AiOutlineCalendar className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />
                        }
                      >
                        <Popover>
                          <Popover.Button>
                            <div className="flex items-center font-mono outline-none border-none overflow-x-auto">
                              <input
                                placeholder={`${format(
                                  startDate,
                                  "dd MMM yy"
                                )} - ${format(endDate, "dd MMM yy")}`}
                                className="border-none outline-none bg-transparent flex-grow text-black font-bold placeholder-black text-xs lg:text-lg cursor-pointer"
                                type="text"
                              />
                              <BiChevronDown
                                className="h-5 w-5 text-gray-400 ml-2"
                                aria-hidden="true"
                              />
                            </div>
                          </Popover.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                          >
                            <Popover.Panel className="fixed top-0 left-0 sm:absolute sm:top-auto sm:left-auto z-50 bg-white border rounded shadow-black shadow-2xl">
                              <DateRange
                                ranges={[selectionRange]}
                                minDate={new Date()}
                                rangeColors={["#253adc"]}
                                maxDate={add(new Date(), { days: 300 })}
                                months={10}
                                direction="vertical"
                                onChange={handleSelect}
                                className="h-72 overflow-y-scroll"
                                moveRangeOnFirstSelection={true}
                                retainEndDateOnFirstSelection={true}
                              />
                              <div className="flex justify-center py-3 border-t">
                                <Popover.Overlay>
                                  <button
                                    id="close_date_popover"
                                    className="bg-blue-500 text-white font-semibold p-3 rounded"
                                  >
                                    Done
                                  </button>
                                </Popover.Overlay>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </Popover>
                      </SearchFormField>
                    </div>

                    {/* Row 3 - Weather */}
                    <div className="flex w-full overflow-x-auto justify-center space-x-4">
                      <div className="hidden lg:flex items-center bg-gray-100 shadow rounded p-2 my-2 cursor-pointer hover:bg-gray-200">
                        <FiChevronLeft />
                      </div>
                      {selectedCityWeatherData
                        .slice(0, 7)
                        .map(
                          (
                            {
                              date,
                              temp_c,
                              temp_max_c,
                              temp_min_c,
                              condition,
                              conditionCode,
                            },
                            i
                          ) => (
                            <WeatherCellNew
                              key={i}
                              date={date}
                              avg={temp_c}
                              low={temp_min_c}
                              high={temp_max_c}
                              text={condition}
                              conditionCode={conditionCode}
                              isCurrentDay={i == 0 ? true : false}
                            />
                          )
                        )}
                      <div className="hidden lg:flex items-center bg-gray-100 shadow rounded p-2 my-2 cursor-pointer hover:bg-gray-200">
                        <FiChevronRight />
                      </div>
                    </div>
                  </div>

                  {/* Table Row */}
                  <div className="w-full p-6">
                    <Tab.Group
                      selectedIndex={selectedIndex}
                      onChange={setSelectedIndex}
                    >
                      <Tab.List className="flex overflow-x-auto space-x-1 rounded-xl p-1 mb-6">
                        {Object.keys(categories).map((category) => (
                          <Tab
                            key={category}
                            className={({ selected }) =>
                              `w-full rounded-lg py-2.5 text-xs lg:text-lg font-extrabold leading-5 transition focus:outline-none ${
                                selected
                                  ? "bg-blue-100 text-blue-500 hover:bg-blue-200 shadow"
                                  : "bg-white text-gray-600 hover:bg-gray-200"
                              }`
                            }
                          >
                            {category}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels className="w-full mt-2 overflow-x-auto">
                        {selectedIndex === 0 ? (
                          <AttractionsList lat={lat} long={long} />
                        ) : selectedIndex == 1 ? (
                          <FlightsList lat={lat} long={long} />
                        ) : selectedIndex === 2 ? (
                          <TrainsList lat={lat} long={long} />
                        ) : selectedIndex === 3 ? (
                          <AccommodationList lat={lat} long={long} />
                        ) : selectedIndex === 4 ? (
                          <RestaurantsList lat={lat} long={long} />
                        ) : (
                          <div>
                            <p>Panel Coming Soon...</p>
                          </div>
                        )}
                        {/* {Object.values(categories).map((items, idx) => (
                          <Tab.Panel key={idx} className="rounded-xl p-3">
                            <ul className="flex flex-col space-y-2">
                              {items ? (
                                items.map((item, i) => (
                                  <li
                                    key={i}
                                    className="relative rounded-md p-3 hover:bg-gray-100 bg-white shadow"
                                  >
                                    {}
                                    <h3 className="text-sm font-medium leading-5">
                                      {item.name}
                                    </h3>
                                  </li>
                                ))
                              ) : (
                                <div className="w-full flex justify-center items-center">
                                  <Ring />
                                </div>
                              )}
                            </ul>
                            <AccommodationList
                              key="jjkds"
                              lat={lat}
                              long={long}
                            />
                          </Tab.Panel>
                        ))} */}
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
