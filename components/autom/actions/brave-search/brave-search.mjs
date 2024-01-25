import autom from "../../autom.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "autom-brave-search",
  name: "Brave Search",
  description: "Scrape the results from Brave search engine using Autom.dev. [See the documentation](https://docs.autom.dev/api-reference/brave/search)",
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
          engine: "brave",
        }),
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

    $.export("$summary", `Successfully retrieved search results for query "${this.query}" using Brave search engine`);
    return response;
  },
};
