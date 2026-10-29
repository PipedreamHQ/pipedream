import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-maps-search",
  name: "Maps Search",
  description: "Find places on Google Maps: name, rating, category, address, phone, website, `place_id` and coordinates. Put the area in Location or in the query. Failed and empty requests are not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/maps)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    ll: {
      type: "string",
      label: "Map Viewport",
      description: "Search around an exact point, as `@lat,lng,14z`.",
      optional: true,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.post({
      $,
      path: "/maps",
      data: {
        q: this.q,
        location: this.location,
        ll: this.ll,
        country: this.country,
        language: this.language,
        page: this.page,
      },
    });
    $.export("$summary", `Retrieved ${response.results?.length ?? 0} results`);
    return response;
  },
};
