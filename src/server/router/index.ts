// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { forecastRouter } from "./forecast";

export const appRouter = createRouter().transformer(superjson).merge("forecast.", forecastRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
