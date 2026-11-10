import tablejourney from "../../tablejourney.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "tablejourney-list-cities",
  name: "List Cities",
  description: "List every city TableJourney covers, with the `country` and `city` slugs the other tools take, the display names and the city's `page` on tablejourney.com."
    + " Call this first when unsure whether a city is covered or what its slug is, before **Get Things To Do**, **Search Places**, **List Festivals**, **List Experiences**, **List Stays** or **List Dishes**."
    + " Example: Country `italy` returns `[{\"country\": \"italy\", \"city\": \"bologna\", \"name\": \"Bologna\", \"country_name\": \"Italy\", \"page\": \"https://tablejourney.com/italy/bologna/\"}, ...]`."
    + " [See the documentation](https://tablejourney.com/api/v1/docs#/places/cities_api_v1_cities_get)",
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
      description: "Return only the cities in this country, e.g. `italy`. Omit to list every city.",
      optional: true,
    },
  },
  async run({ $ }) {
    const cities = await this.tablejourney.listCities({
      $,
      params: {
        country: this.country,
      },
    });
    $.export("$summary", `Found ${utils.pluralize(utils.countOf(cities), "city", "cities")}`);
    return cities;
  },
};
