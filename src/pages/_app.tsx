// src/pages/_app.tsx
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import type { AppType } from "next/dist/shared/lib/utils";
import toast, { Toaster } from "react-hot-toast";
import superjson from "superjson";
import { useStore } from "../components/appStore";
import Footer from "../components/Footer";
import Header from "../components/Header";
import type { AppRouter } from "../server/router";
import "../styles/globals.css";
import { useEffect } from "react";

const MyApp: AppType = ({ Component, pageProps }) => {
	const setUserLat = useStore((state) => state.setUserLat);
	const setUserLong = useStore((state) => state.setUserLong);
	const setUserCity = useStore((state) => state.setUserCity);

	useEffect(() => {
		if (!("geolocation" in navigator)) {
			prompt("Geolocation not supported");
		}
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setUserLat(position.coords.latitude);
				setUserLong(position.coords.longitude);
			},
			(error) => {
				toast.error("Please approve location permission - we do not save this data.");
			}
		);
	}, []);

	return (
		<>
			<Header />
			<Component {...pageProps} />
			<Footer />
			<Toaster />
		</>
	);
};

const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			links: [
				loggerLink({
					enabled: (opts) => process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
				}),
				httpBatchLink({ url }),
			],
			url,
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },

			// To use SSR properly you need to forward the client's headers to the server
			// headers: () => {
			//   if (ctx?.req) {
			//     const headers = ctx?.req?.headers;
			//     delete headers?.connection;
			//     return {
			//       ...headers,
			//       "x-ssr": "1",
			//     };
			//   }
			//   return {};
			// }
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);
