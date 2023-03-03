export default function celsiusToFahrenheit(celsiusTemp: number | string) {
  if (typeof celsiusTemp === "string") {
    return parseFloat(celsiusTemp) * 1.8 + 32;
  } else {
    return celsiusTemp * 1.8 + 32;
  }
}
