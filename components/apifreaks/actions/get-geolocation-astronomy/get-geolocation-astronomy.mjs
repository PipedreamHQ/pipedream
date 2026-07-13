import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-geolocation-astronomy",
  name: "Astronomy Lookup by IP or Coordinates",
  description: "Retrieve sunrise and sunset times, current position of the moon, and other related information by specifying a location address, location coordinates, IP address, or using the client IP address if no parameter is passed. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    location: {
      type: "string",
      label: "Location",
      description: "Extract astronomy information using location (preferably city)",
      optional: true,
    },
    lat: {
      type: "string",
      label: "Lat",
      description: "Latitude to extract astronomy information using location coordinates",
      optional: true,
    },
    long: {
      type: "string",
      label: "Long",
      description: "Longitude to extract astronomy information using location coordinates",
      optional: true,
    },
    ip: {
      type: "string",
      label: "Ip",
      description: "IPv4 or IPv6 address to extract astronomy information using IP address",
      optional: true,
    },
    lang: {
      type: "string",
      label: "Lang",
      description: "Response language of \"location\" field in case of lookup through IP address only.",
      optional: true,
      options: ["en","de","ru","ja","fr","cn","es","cs","it","ko","fa","pt"],
    },
    date: {
      type: "string",
      label: "Date",
      description: "Specific date (format YYYY-MM-DD) for which astronomy data is required",
      optional: true,
    },
    elevation: {
      type: "string",
      label: "Elevation",
      description: "Elevation above sea level at the location, in meters. The value should be between 0 meter and a maximum value of 10,000 meters. Negative value is set to 0.",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "Time zone to receive all time-based data in your preferred local time.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/geolocation/astronomy",
      params: {
        location: this.location,
        lat: this.lat,
        long: this.long,
        ip: this.ip,
        lang: this.lang,
        date: this.date,
        elevation: this.elevation,
        "time_zone": this.timeZone,
      },
    });
    $.export("$summary", "Successfully executed Astronomy Lookup by IP or Coordinates");
    return response;
  },
};
