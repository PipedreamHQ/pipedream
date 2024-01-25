import autom from "../../autom.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "autom-google-search",
  name: "Google Search",
  description: "Scrape the results from the Google search engine using the Autom.dev API. [See the documentation](https://docs.autom.dev/api-reference/google/search)",
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
          options: [
            {
              label: "Google",
              value: "google",
            },
          ],
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

    $.export("$summary", `Successfully retrieved search results for query "${this.query}"`);
    return response;
  },
};
