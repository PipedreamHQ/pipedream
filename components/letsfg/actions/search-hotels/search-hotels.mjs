import app from "../../letsfg.app.mjs";

export default {
  key: "letsfg-search-hotels",
  name: "Search Hotels",
  description: "Search real, bookable hotel inventory. Only free-cancellation, pay-later rates are returned, so every result can actually be booked. Requires a payment method on file — for search as well as booking. [See the documentation](https://letsfg.co/developers/docs/hotels/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    checkIn: {
      propDefinition: [
        app,
        "checkIn",
      ],
    },
    checkOut: {
      propDefinition: [
        app,
        "checkOut",
      ],
    },
    adults: {
      propDefinition: [
        app,
        "adults",
      ],
      default: 2,
    },
    nationality: {
      propDefinition: [
        app,
        "nationality",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    // The supplier needs a numeric id AND the display name, so the option
    // value carries both. Split on the first separator only — city names
    // legitimately contain punctuation.
    const separatorIndex = this.city.indexOf("|");
    if (separatorIndex < 1) {
      throw new Error("City must be in the form `id|Name`, e.g. `148614|Warsaw, Poland`. Pick a city from the dropdown, or use the Resolve Hotel City action to look one up.");
    }
    const cityId = parseInt(this.city.slice(0, separatorIndex), 10);
    const cityName = this.city.slice(separatorIndex + 1);

    const response = await this.app.searchHotels({
      $,
      data: {
        city_id: cityId,
        city_name: cityName,
        check_in: this.checkIn,
        check_out: this.checkOut,
        adults: this.adults,
        nationality: this.nationality,
        limit: this.limit,
      },
    });

    const count = response?.count ?? 0;
    $.export("$summary", `Found ${count} bookable hotel${count === 1
      ? ""
      : "s"} in ${cityName}`);

    return response;
  },
};
