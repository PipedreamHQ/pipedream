import app from "../../linkup.app.mjs";

export default {
  name: "Linkup Search",
  description: "Search and retrieve insights using the Linkup API. [See the documentation](https://docs.linkup.so/pages/api-reference/endpoint/post-search)",
  key: "linkup-search",
  version: "0.1.1",
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
  additionalProps(props) {
    if (this.outputType === "structured") {
      props.structuredOutputSchema.optional = false;
      props.structuredOutputSchema.hidden = false;
      props.structuredOutputSchema.default = `{
        "type": "object",
        "properties": {
          "results": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "year": {
                  "type": "number"
                }
              },
              "required": [
                "name",
                "year"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "results"
        ],
        "additionalProperties": false
      }`;
    }
    return {};
  },
  async run({ $ }) {
    try {
      const response = await this.app.search({
        query: this.query,
        depth: this.depth,
        outputType: this.outputType,
        structuredOutputSchema:
          this.structuredOutputSchema && JSON.parse(this.structuredOutputSchema),
        includeImages: this.includeImages,
      });
      $.export("$summary", "Successfully completed search query");
      return response;
    } catch (error) {
      console.error("Error calling Linkup API:", error);
      throw new Error(`Failed to fetch data from Linkup API: ${error.message}`);
    }
  },
};
