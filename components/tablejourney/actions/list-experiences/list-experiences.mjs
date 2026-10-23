import tablejourney from "../../tablejourney.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "tablejourney-list-experiences",
  name: "List Experiences",
  description: "List bookable food tours, cooking classes, tastings and tickets in a city, with title, price, rating, review count, image and a `book` link that forwards to the booking partner (GetYourGuide, Viator or Musement) through TableJourney."
    + " Use **List Cities** to find valid `country` and `city` slugs, and **Get Things To Do** for experiences together with places, festivals and stays."
    + " Example: City `rome`, Query `cooking class`."
    + " [See the documentation](https://tablejourney.com/api/v1/docs#/bookable/experiences_api_v1_experiences_get)",
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
      description: "Free text to match in the experience title or description, e.g. `cooking class`, `wine tasting` or `market tour`.",
    },
    partner: {
      type: "string",
      label: "Partner",
      description: "Return only one booking partner's products. One of `gyg` (GetYourGuide), `viator`, `musement`, e.g. `viator`.",
      options: constants.PARTNER_OPTIONS,
      optional: true,
    },
    foodOnly: {
      type: "boolean",
      label: "Food Only",
      description: "Set to `true` to return only food and drink experiences (tours, classes, tastings), leaving out general sightseeing tickets, e.g. `true`. Defaults to `false`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        tablejourney,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const experiences = await this.tablejourney.listExperiences({
      $,
      params: {
        country: this.country,
        city: this.city,
        q: this.query,
        partner: this.partner,
        food_only: this.foodOnly,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${utils.pluralize(utils.countOf(experiences), "experience")}`);
    return experiences;
  },
};
