import harpaAi from "../../harpa_ai.app.mjs";

export default {
  key: "harpa_ai-search-the-web",
  name: "Search the Web",
  description: "Search the web. [See the documentation](https://harpa.ai/grid/grid-rest-api-reference#search-the-web)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    harpaAi,
    query: {
      type: "string",
      label: "Query",
      description: "The search term or a query string to search for. Supports search parameters like **site:example.com** or **intitle:keyword**.",
    },
    node: {
      propDefinition: [
        harpaAi,
        "node",
      ],
    },
    timeout: {
      propDefinition: [
        harpaAi,
        "timeout",
      ],
    },
    resultsWebhook: {
      propDefinition: [
        harpaAi,
        "resultsWebhook",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.harpaAi.sendAction({
      $,
      data: {
        action: "serp",
        query: this.query,
        node: this.node,
        timeout: this.timeout,
        resultsWebhook: this.resultsWebhook,
      },
    });
    $.export("$summary", `Searched the web for ${this.query}`);
    return response;
  },
};
