import axios from "axios";
import { trpc } from "../utils/trpc";
import { useStore } from "./appStore";
import CityResult from "./CityResult";
import { useEffect, useRef, useState } from "react";
import coordinatesToISO from "../utils/coordinatesToISO";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import autoAnimate from "@formkit/auto-animate";
import { useMemo, memo } from "react";

export type CityResult = {
  cityName: string;
  countryName: string;
  distance: number;
  lat: number;
  long: number;
  population: number;
  imageUrl: string;
  flightTime: number;
  transportTime: number;
  driveTime: number;
  weatherData: number[];
  isUserHere: boolean;
  cityId: string;
  isFarPlace?: boolean;
};

type Props = {
  tableData: CityResult[];
  pageNumber: number;
};

function ResultsTable({ tableData, pageNumber }: Props) {
  const userLat = useStore((state) => state.userLat);
  const userLong = useStore((state) => state.userLong);
  const userCity = useStore((state) => state.userCity);
  const userCountry = useStore((state) => state.userCountry);
  const isViewingHome = useStore((state) => state.isViewingHome);

  const sortedTableDataMemoized = useMemo(() => {
    return tableData.sort((a, b) => a.distance - b.distance);
  }, [tableData]);

  // Animations
  const tableRef = useRef(null);
  useEffect(() => {
    tableRef.current && autoAnimate(tableRef.current);
  }, [tableRef]);

  //   Animations
  const resultsListRef = useRef(null);
  useEffect(() => {
    resultsListRef.current && autoAnimate(resultsListRef.current);
  }, [tableRef]);

  return (
    <div ref={tableRef}>
      <div
        className="grid grid-cols-1 grid-rows-1 overflow-hidden sm:grid-cols-3 lg:grid-cols-5 gap-2"
        ref={resultsListRef}
      >
        {sortedTableDataMemoized &&
          sortedTableDataMemoized
            .slice(pageNumber, pageNumber + 5)
            .map(
              (
                {
                  cityId,
                  cityName,
                  distance,
                  countryName,
                  lat,
                  long,
                  isFarPlace,
                },
                i
              ) => (
                <CityResult
                  key={cityName}
                  cityId={cityId}
                  cityName={cityName}
                  distance={distance}
                  latitude={lat}
                  longitude={long}
                  countryName={countryName}
                  isUserHere={
                    i == 0 && pageNumber == 0 && isViewingHome ? true : false
                  }
                  isFarPlace={isFarPlace}
                />
              )
            )}
      </div>
    </div>
  );
}
export default memo(ResultsTable);
