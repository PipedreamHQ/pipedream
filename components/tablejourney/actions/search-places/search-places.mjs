import tablejourney from "../../tablejourney.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "tablejourney-search-places",
  name: "Search Places",
  description: "Search editorially checked places to eat and drink: restaurants, cafes, bakeries, markets, street food, bars and more."
    + " Filter by text, city, kind, cuisine, dietary need, price tier, opening time, or distance from a point; results are ranked by relevance, then editorial score."
    + " Use **List Cities** to find valid `country` and `city` slugs, and **List Dishes** to find where a city's signature dishes are served."
    + " Each result has an `id`, a one-line `summary` and a `page` on tablejourney.com with the address, opening hours and sources."
    + " Example: City `rome`, Kind `bakeries`, Open At `sunday 09:00`."
    + " [See the documentation](https://tablejourney.com/api/v1/docs#/places/places_api_v1_places_get)",
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
    query: {
      propDefinition: [
        tablejourney,
        "query",
      ],
      description: "Free text: a venue name, dish, cuisine, neighbourhood or theme, e.g. `carbonara` or `trastevere`.",
    },
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
    kind: {
      type: "string",
      label: "Kind",
      description: "A place type, e.g. `bakeries`, or a group: `eat`, `drink`, `bake` or `do`."
        + " Other values: `restaurants`, `casual-dining`, `fine-dining`, `street-food`, `markets`, `cafes`, `bars`, `wine-bars`, `breweries`.",
      options: constants.KIND_OPTIONS,
      optional: true,
    },
    cuisine: {
      type: "string",
      label: "Cuisine",
      description: "A cuisine to match, e.g. `roman` or `japanese`.",
      optional: true,
    },
    dietary: {
      type: "string",
      label: "Dietary",
      description: "A dietary need, e.g. `vegan`. One of `vegan`, `vegetarian`, `gluten-free`, `halal`, `kosher`, `dairy-free`, `nut-free`, `pescatarian`.",
      options: constants.DIETARY_OPTIONS,
      optional: true,
    },
    priceTier: {
      type: "string",
      label: "Price Tier",
      description: "The price tier in the local currency symbol, e.g. `€€` in Italy or `$$$` in the United States.",
      optional: true,
    },
    openAt: {
      type: "string",
      label: "Open At",
      description: "Return only places open at this time (UTC): `now`, a weekday and time such as `sunday 10:00`, or an ISO 8601 date-time, e.g. `2026-11-01T19:30:00Z`.",
      optional: true,
    },
    near: {
      type: "string",
      label: "Near",
      description: "A point as `latitude,longitude`, e.g. `41.8986,12.4769`. Results are sorted by distance from it.",
      optional: true,
    },
    radiusKm: {
      type: "string",
      label: "Radius (km)",
      description: "Search radius in kilometres around **Near**, e.g. `1.5`. Defaults to `3`. Only used with **Near**.",
      optional: true,
    },
    limit: {
      propDefinition: [
        tablejourney,
        "limit",
      ],
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip, for paging, e.g. `20` for the second page of 20. Defaults to `0`.",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const places = await this.tablejourney.searchPlaces({
      $,
      params: {
        q: this.query,
        country: this.country,
        city: this.city,
        kind: this.kind,
        cuisine: this.cuisine,
        dietary: this.dietary,
        price_tier: this.priceTier,
        open_at: this.openAt,
        near: this.near,
        radius_km: this.radiusKm,
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Found ${utils.pluralize(utils.countOf(places), "place")}`);
    return places;
  },
};
