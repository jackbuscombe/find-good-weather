// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { forecastRouter } from "./forecast";
import { placesRouter } from "./places";
import { accommodationRouter } from "./accommodation";
import { flightsRouter } from "./flights";
import { restaurantsRouter } from "./restaurants";
import { attractionsRouter } from "./attractions";

export const appRouter = createRouter().transformer(superjson).merge("forecast.", forecastRouter).merge("places.", placesRouter).merge("accommodation.", accommodationRouter).merge("flights.", flightsRouter).merge("restaurants.", restaurantsRouter).merge("attractions.", attractionsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
