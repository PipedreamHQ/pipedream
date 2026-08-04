import app from "../../letsfg.app.mjs";

export default {
  key: "letsfg-search-flights",
  name: "Search Flights",
  description: "Search hundreds of airlines and the major booking sites for flights. [See the documentation](https://letsfg.co/developers/docs/api-search/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    origin: {
      propDefinition: [
        app,
        "origin",
      ],
    },
    destination: {
      propDefinition: [
        app,
        "destination",
      ],
    },
    departureDate: {
      propDefinition: [
        app,
        "departureDate",
      ],
    },
    returnDate: {
      propDefinition: [
        app,
        "returnDate",
      ],
    },
    adults: {
      propDefinition: [
        app,
        "adults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchFlights({
      $,
      data: {
        origin: this.origin,
        destination: this.destination,
        departure_date: this.departureDate,
        return_date: this.returnDate,
        adults: this.adults,
      },
    });

    const count = response?.offers?.length ?? 0;
    $.export("$summary", `Found ${count} flight offer${count === 1
      ? ""
      : "s"} for ${this.origin} to ${this.destination}`);

    return response;
  },
};
