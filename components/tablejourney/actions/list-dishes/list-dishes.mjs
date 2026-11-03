import tablejourney from "../../tablejourney.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "tablejourney-list-dishes",
  name: "List Dishes",
  description: "List a city's signature dishes, each with a short `summary` and `where_to_eat`: the places that serve it, with their `id` and `page`."
    + " Use it for \"what should I eat here\". Use **List Cities** to find valid `country` and `city` slugs, and **Search Places** with a dish name as the query for more places."
    + " Example: City `rome`, or Query `ramen` to find the dish across cities."
    + " [See the documentation](https://tablejourney.com/api/v1/docs#/places/dishes_api_v1_dishes_get)",
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
      optional: true,
    },
    city: {
      propDefinition: [
        tablejourney,
        "city",
        (c) => ({
          country: c.country,
        }),
      ],
      optional: true,
    },
    query: {
      propDefinition: [
        tablejourney,
        "query",
      ],
      description: "Free text to match in the dish name or description, e.g. `cacio e pepe` or `ramen`.",
    },
    limit: {
      propDefinition: [
        tablejourney,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const dishes = await this.tablejourney.listDishes({
      $,
      params: {
        country: this.country,
        city: this.city,
        q: this.query,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${utils.pluralize(utils.countOf(dishes), "dish", "dishes")}`);
    return dishes;
  },
};
