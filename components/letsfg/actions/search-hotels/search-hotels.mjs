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
    cityId: {
      propDefinition: [
        app,
        "cityId",
      ],
    },
    cityName: {
      propDefinition: [
        app,
        "cityName",
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
    const response = await this.app.searchHotels({
      $,
      data: {
        city_id: this.cityId,
        city_name: this.cityName,
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
      : "s"} in ${this.cityName}`);

    return response;
  },
};
