import autom from "../../autom.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "autom-bing-search",
  name: "Bing Search",
  description: "Scrape the results from Bing search engine via the Autom.dev service. [See the documentation](https://docs.autom.dev/api-reference/bing/search)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    autom,
    query: {
      propDefinition: [
        autom,
        "query",
      ],
    },
    page: {
      propDefinition: [
        autom,
        "page",
      ],
    },
    async: {
      propDefinition: [
        autom,
        "async",
      ],
    },
    apiKey: {
      propDefinition: [
        autom,
        "apiKey",
      ],
    },
    engine: {
      propDefinition: [
        autom,
        "engine",
        (c) => ({
          engine: "bing",
        }), // Since we're specifically scraping Bing, we set the engine prop to "bing"
      ],
    },
  },
  async run({ $ }) {
    const response = await this.autom.search({
      engine: this.engine,
      apiKey: this.apiKey,
      query: this.query,
      page: this.page,
      async: this.async,
    });

    $.export("$summary", `Successfully retrieved search results for query "${this.query}"`);
    return response;
  },
};
