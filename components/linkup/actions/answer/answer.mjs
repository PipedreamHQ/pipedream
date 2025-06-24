import app from "../../linkup.app.mjs";

export default {
  name: "Linkup Answer",
  description: "Get a natural language answer to your natural language question.",
  key: "linkup-answer",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "The search query for Linkup.",
    },
    depth: {
      type: "string",
      label: "Search Depth",
      description: "Defines the precision of the search. `standard` returns results quickly; `deep` takes longer but yields more complete results.",
      options: [
        "standard",
        "deep",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.app.search({
        query: this.query,
        depth: this.depth,
        outputType: "sourcedAnswer",
      });
      $.export("$summary", "Successfully completed search query");
      return response;
    } catch (error) {
      console.error("Error calling Linkup API:", error);
      throw new Error(`Failed to fetch data from Linkup API: ${error.message}`);
    }
  },
};
