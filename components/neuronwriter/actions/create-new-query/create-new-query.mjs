import neuronwriter from "../../neuronwriter.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "neuronwriter-create-new-query",
  name: "Create New Query",
  description: "Launches a new query based on provided keyword, search engine, and language. Afterwards, NeuronWriter yields recommendations for SEO optimized content. The processing usually requires around a minute.",
  version: "0.0.1",
  type: "action",
  props: {
    neuronwriter,
    keyword: {
      propDefinition: [
        neuronwriter,
        "keyword",
      ],
    },
    searchEngine: {
      propDefinition: [
        neuronwriter,
        "searchEngine",
      ],
    },
    language: {
      propDefinition: [
        neuronwriter,
        "language",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.neuronwriter.createNewQuery({
      keyword: this.keyword,
      searchEngine: this.searchEngine,
      language: this.language,
    });

    let queryResult = null;
    const maxAttempts = 6;
    const interval = 10000;
    let attempts = 0;

    while (attempts < maxAttempts && (!queryResult || queryResult.status !== "ready")) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      queryResult = await this.neuronwriter.getQueryResults({
        queryId: response.query,
      });
      attempts++;
    }

    if (!queryResult || queryResult.status !== "ready") {
      throw new Error("Query processing exceeded the maximum wait time or failed to complete.");
    }

    $.export("$summary", `Successfully created and processed query for keyword: ${this.keyword}`);
    return queryResult;
  },
};
