import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-map-site",
  name: "Map Site",
  description: "List a website's URLs from its sitemaps and start page, optionally ranked by a search phrase. Free when nothing is found ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/map)",
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
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    search: {
      type: "string",
      label: "Search",
      description: "Keep only URLs relevant to these words, most relevant first.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum URLs to return (1-5,000, default 100).",
      optional: true,
      min: 1,
      max: 5000,
    },
  },
  async run({ $ }) {
    const response = await this.app.post({
      $,
      path: "/map",
      data: {
        url: this.url,
        search: this.search,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${response.results?.length ?? 0} URLs`);
    return response;
  },
};
