import { Button, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RiSunCloudyFill } from "react-icons/ri";
import { useStore } from "./appStore";
import { WeatherObject, YahooWeatherObject } from "../types";
import getWeatherIcon, { getWeatherIconCurrent } from "../utils/getWeatherIcon";
import celsiusToFahrenheit from "../utils/celsiusToFahrenheit";
import { Transition } from "@headlessui/react";
import { useEffect, useRef } from "react";

type Props = {
  date: number;
  avg: number;
  low: number;
  high: number;
  text: string;
  conditionCode: number;
  isCurrentDay?: boolean;
};

function WeatherCell({
  date,
  avg,
  low,
  high,
  text,
  conditionCode,
  isCurrentDay = false,
}: Props) {
  const [opened, { close, open }] = useDisclosure(false);
  const celsius = useStore((state) => state.celsius);
  const setCelsius = useStore((state) => state.setCelsius);

  return (
    <>
      <Popover
        width={200}
        position="bottom"
        withArrow
        shadow="md"
        opened={opened}
      >
        <Popover.Target>
          <div
            onMouseEnter={open}
            onMouseLeave={close}
            className={`flex items-center ${
              isCurrentDay
                ? "bg-blue-100 hover:bg-blue-200"
                : "bg-gray-50 hover:bg-gray-100"
            } shadow rounded p-2 my-2 cursor-pointer font-mono`}
          >
            <div className="w-full flex justify-center items-center space-x-4 text-center">
              <img
                src={
                  isCurrentDay
                    ? getWeatherIconCurrent(
                        (text ||
                          (
                            getWeatherDescriptionFromCode as {
                              [index: number]: string;
                            }
                          )[conditionCode]) ??
                          "clear"
                      )
                    : getWeatherIcon(
                        (text ||
                          (
                            getWeatherDescriptionFromCode as {
                              [index: number]: string;
                            }
                          )[conditionCode]) ??
                          "clear"
                      )
                }
                alt={
                  (text ||
                    (
                      getWeatherDescriptionFromCode as {
                        [index: number]: string;
                      }
                    )[conditionCode]) ??
                  "clear"
                }
                className="h-10 w-10"
              />
              <div className="flex flex-col items-center">
                <p
                  className={`text-xl font-bold leading-5 ${
                    isCurrentDay ? "text-blue-500" : "text-black"
                  }`}
                >{`${
                  celsius
                    ? `${avg.toFixed(0)}°C`
                    : `${celsiusToFahrenheit(avg).toFixed(0)}°F`
                }`}</p>
                <p className="text-gray-500 text-sm">
                  {`${format(new Date(date * 1000), "dd EEE").toUpperCase()}`}
                </p>
              </div>
            </div>
          </div>
        </Popover.Target>
        <Popover.Dropdown
          sx={{
            pointerEvents: "none",
            backgroundColor: "#fafafa",
            zIndex: "auto",
          }}
        >
          <div className="flex flex-col space-y-2 z-50">
            <p className="font-extrabold text-center">{`${new Date(
              date * 1000
            ).toDateString()}`}</p>

            <div className="flex justify-center items-center space-x-4 mb-2">
              <img
                src={getWeatherIcon(
                  (text ||
                    (
                      getWeatherDescriptionFromCode as {
                        [index: number]: string;
                      }
                    )[conditionCode]) ??
                    "clear"
                )}
                alt={
                  text ||
                  (
                    getWeatherDescriptionFromCode as { [index: number]: string }
                  )[conditionCode]
                }
                className="h-12 w-12"
              />

              <div>
                <p className="text-lg text-black font-bold">{`${
                  celsius
                    ? `${avg.toFixed(0)}°C`
                    : `${celsiusToFahrenheit(avg).toFixed(0)}°F`
                }`}</p>
                <p className="text-gray-500">
                  {text ||
                    (
                      getWeatherDescriptionFromCode as {
                        [index: number]: string;
                      }
                    )[conditionCode]}
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <p className="text-gray-500">Min Temp</p>
                <p className="text-black font-bold">{`${
                  celsius
                    ? `${low.toFixed(0)}°C`
                    : `${celsiusToFahrenheit(low).toFixed(0)}°F`
                }`}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Max Temp</p>
                <p className="text-black font-bold">{`${
                  celsius
                    ? `${high.toFixed(0)}°C`
                    : `${celsiusToFahrenheit(high).toFixed(0)}°F`
                }`}</p>
              </div>
            </div>
          </div>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}
import autoAnimate from "@formkit/auto-animate";
import { getWeatherDescriptionFromCode } from "../utils/getWeatherDescriptionFromCode";
import { format } from "date-fns";
export default WeatherCell;

// function WeatherCell({ temp, tempMin, tempMax, feelsLike, humidity, windSpeed, description, icon, timestamp }: WeatherObject) {
// 	const [opened, { close, open }] = useDisclosure(false);
// 	const celsius = useStore((state) => state.celsius);
// 	const setCelsius = useStore((state) => state.setCelsius);

// 	return (
// 		<>
// 			<Popover width={200} position="bottom" withArrow shadow="md" opened={opened}>
// 				<Popover.Target>
// 					<div onMouseEnter={open} onMouseLeave={close} className="flex flex-col items-center space-y-2 bg-gray-100 shadow rounded p-2 my-2 cursor-pointer hover:bg-gray-200">
// 						<p className="font-light">{new Date(timestamp * 1000).toDateString()}</p>
// 						<div className="flex justify-center items-center space-x-2">
// 							<img src={icon} alt={description} className="h-12 w-12" />
// 							<div>
// 								<p className="text-lg text-black font-bold">{`${temp.toFixed(0)}${celsius ? "°C" : "°F"}`}</p>
// 								<p className="text-gray-500">{description}</p>
// 							</div>
// 						</div>
// 					</div>
// 				</Popover.Target>
// 				<Popover.Dropdown sx={{ pointerEvents: "none", backgroundColor: "#fafafa", zIndex: "auto" }}>
// 					<div className="flex flex-col space-y-2 z-50">
// 						<p className="font-extrabold text-center">{new Date(timestamp * 1000).toDateString()}</p>

// 						<div className="flex justify-center items-center space-x-4 mb-2">
// 							<img src={icon} alt={description} className="h-12 w-12" />

// 							<div>
// 								<p className="text-lg text-black font-bold">{`${temp.toFixed(0)}${celsius ? "°C" : "°F"}`}</p>
// 								<p className="text-gray-500">{description}</p>
// 							</div>
// 						</div>
// 						<div className="flex flex-col">
// 							<div className="flex justify-between">
// 								<p className="text-gray-500">Feels Like</p>
// 								<p className="text-black font-bold">{`${feelsLike.toFixed(0)}${celsius ? "°C" : "°F"}`}</p>
// 							</div>
// 							<div className="flex justify-between">
// 								<p className="text-gray-500">Min Temp</p>
// 								<p className="text-black font-bold">{`${tempMin.toFixed(0)}${celsius ? "°C" : "°F"}`}</p>
// 							</div>
// 							<div className="flex justify-between">
// 								<p className="text-gray-500">Max Temp</p>
// 								<p className="text-black font-bold">{`${tempMax.toFixed(0)}${celsius ? "°C" : "°F"}`}</p>
// 							</div>
// 							<div className="flex justify-between">
// 								<p className="text-gray-500">Humidity</p>
// 								<p className="text-black font-bold">{humidity}%</p>
// 							</div>
// 							<div className="flex justify-between">
// 								<p className="text-gray-500">Wind Speed</p>
// 								<p className="text-black font-bold">{windSpeed.toFixed(0)}km/h</p>
// 							</div>
// 						</div>
// 					</div>
// 				</Popover.Dropdown>
// 			</Popover>
// 		</>
// 	);
// }
// export default WeatherCell;
