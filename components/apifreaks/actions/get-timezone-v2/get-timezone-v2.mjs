import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-timezone-v2",
  name: "Timezone Lookup (V2.0)",
  description: "Retrieve current time, date, and timezone-related information by specifying a timezone name, location address, location coordinates, IP address, or use the client IP address if no parameter is passed. - v2.0 response format. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    ip: {
      propDefinition: [
        app,
        "ip",
      ],
    },
    tz: {
      type: "string",
      label: "Tz",
      description: "Timezone name (e.g., \"Asia/Kolkata\") to retrieve information directly.",
      optional: true,
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    lat: {
      propDefinition: [
        app,
        "lat",
      ],
    },
    long: {
      propDefinition: [
        app,
        "long",
      ],
    },
    lang: {
      type: "string",
      label: "Lang",
      description: "Language code for response localization (default is \"en\").",
      optional: true,
      options: ["en","de","ru","ja","fr","cn","es","cs","it","ko","fa","pt"],
    },
    iataCode: {
      type: "string",
      label: "Iata Code",
      description: "3-letter IATA airport code (e.g., JFK).",
      optional: true,
    },
    icaoCode: {
      type: "string",
      label: "Icao Code",
      description: "4-letter ICAO airport code (e.g., KJFK).",
      optional: true,
    },
    loCode: {
      type: "string",
      label: "Lo Code",
      description: "5-letter UN/LO city code.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v2.0/geolocation/timezone",
      params: {
        ip: this.ip,
        tz: this.tz,
        location: this.location,
        lat: this.lat,
        long: this.long,
        lang: this.lang,
        "iata_code": this.iataCode,
        "icao_code": this.icaoCode,
        "lo_code": this.loCode,
      },
    });
    $.export("$summary", "Successfully executed Timezone Lookup (V2.0)");
    return response;
  },
};
