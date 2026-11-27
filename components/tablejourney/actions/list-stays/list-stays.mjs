import tablejourney from "../../tablejourney.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "tablejourney-list-stays",
  name: "List Stays",
  description: "List hotels and places to stay in a city: individual `hotels` (with nearby places) and the stay `partners` that cover the city, each with a `book` link that forwards to the booking partner through TableJourney."
    + " Use **List Cities** to find valid `country` and `city` slugs."
    + " Example: Country `italy`, City `rome`."
    + " [See the documentation](https://tablejourney.com/api/v1/docs#/bookable/stays_api_v1_stays__country___city__get)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tablejourney,
    country: {
      propDefinition: [
        tablejourney,
        "country",
      ],
    },
    city: {
      propDefinition: [
        tablejourney,
        "city",
        (c) => ({
          country: c.country,
        }),
      ],
    },
    limit: {
      propDefinition: [
        tablejourney,
        "limit",
      ],
      description: "Maximum number of hotels to return, e.g. `10`. At most `50`.",
      max: constants.MAX_STAYS_LIMIT,
    },
  },
  async run({ $ }) {
    const response = await this.tablejourney.listStays({
      $,
      country: this.country,
      city: this.city,
      params: {
        limit: this.limit,
      },
    });
    const hotels = utils.countOf(response.hotels);
    const partners = utils.countOf(response.partners);
    $.export("$summary", `Found ${utils.pluralize(hotels, "hotel")} and ${utils.pluralize(partners, "stay partner")} in ${this.city}`);
    return response;
  },
};
