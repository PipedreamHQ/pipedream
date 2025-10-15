import app from "../../serpapi.app.mjs";

export default {
  key: "serpapi-scrape-search",
  name: "Scrape Search",
  description: "Scrape the results from a search engine via SerpApi service. [See the documentation](https://serpapi.com/search-api)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    engine: {
      propDefinition: [
        app,
        "engine",
      ],
    },
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    device: {
      propDefinition: [
        app,
        "device",
      ],
    },
    noCache: {
      propDefinition: [
        app,
        "noCache",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.scrapeSearch({
      $,
      params: {
        engine: this.engine,
      },
      data: {
        q: this.q,
        device: this.device,
        no_cache: Boolean(this.noCache) === true
          ? "true"
          : "false",
      },
    });

    $.export("$summary", `Successfully sent query to '${this.engine}'`);

    return response;
  },
};
