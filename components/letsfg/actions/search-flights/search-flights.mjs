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
    dateFrom: {
      propDefinition: [
        app,
        "dateFrom",
      ],
    },
    returnFrom: {
      propDefinition: [
        app,
        "returnFrom",
      ],
    },
    adults: {
      propDefinition: [
        app,
        "adults",
      ],
    },
    children: {
      propDefinition: [
        app,
        "children",
      ],
    },
    cabinClass: {
      propDefinition: [
        app,
        "cabinClass",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchFlights({
      $,
      data: {
        origin: this.origin,
        destination: this.destination,
        date_from: this.dateFrom,
        return_from: this.returnFrom,
        adults: this.adults,
        children: this.children,
        cabin_class: this.cabinClass,
      },
    });

    const count = response?.total_results ?? response?.offers?.length ?? 0;
    $.export("$summary", `Found ${count} flight offer${count === 1
      ? ""
      : "s"} from ${this.origin} to ${this.destination}`);

    return response;
  },
};
