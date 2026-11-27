import tablejourney from "../../tablejourney.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "tablejourney-list-festivals",
  name: "List Festivals",
  description: "List food festivals with the dates of their next edition (`starts_on`, `ends_on`), filtered by country, city, text or date window."
    + " Use it for \"what food festivals are on while I am there\": set **Date From** and **Date To** to the trip dates."
    + " Use **List Cities** to find valid `country` and `city` slugs; omit both to search every covered city."
    + " Each result has a one-line `summary` and a `page` on tablejourney.com to cite."
    + " Example: Country `italy`, Date From `2026-11-01`, Date To `2026-12-31`."
    + " [See the documentation](https://tablejourney.com/api/v1/docs#/festivals/festivals_api_v1_festivals_get)",
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
    dateFrom: {
      propDefinition: [
        tablejourney,
        "dateFrom",
      ],
      description: "Include festivals ending on or after this ISO 8601 date, e.g. `2026-11-01`. Defaults to today.",
    },
    dateTo: {
      propDefinition: [
        tablejourney,
        "dateTo",
      ],
      description: "Include festivals starting on or before this ISO 8601 date, e.g. `2026-12-31`.",
    },
    query: {
      propDefinition: [
        tablejourney,
        "query",
      ],
      description: "Free text to match in the festival name or description, e.g. `truffle` or `christmas market`.",
    },
    limit: {
      propDefinition: [
        tablejourney,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const festivals = await this.tablejourney.listFestivals({
      $,
      params: {
        country: this.country,
        city: this.city,
        from: this.dateFrom,
        to: this.dateTo,
        q: this.query,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${utils.pluralize(utils.countOf(festivals), "festival")}`);
    return festivals;
  },
};
