export default function milesToKm(miles: number | string) {
  if (typeof miles === "string") {
    return parseFloat(miles) / 1.609344;
  } else {
    return miles / 1.609344;
  }
}
