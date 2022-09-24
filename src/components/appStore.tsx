import create from "zustand";

type State = {
	userCity: string;
	userWeather: string;
	userTemp: number;
	userLat: number;
	userLong: number;
	setUserCity: (city: string) => void;
	setUserWeather: (weather: string) => void;
	setUserTemp: (temp: number) => void;
	setUserLat: (latitude: number) => void;
	setUserLong: (lastName: number) => void;
};

export const useStore = create<State>((set) => ({
	userCity: "",
	userWeather: "",
	userTemp: 0,
	userLat: 0,
	userLong: 0,
	setUserCity: (city) => set({ userCity: city }),
	setUserWeather: (weather) => set({ userWeather: weather }),
	setUserTemp: (temp) => set({ userTemp: temp }),
	setUserLat: (latitude) => set({ userLat: latitude }),
	setUserLong: (longitude) => set({ userLong: longitude }),
}));
