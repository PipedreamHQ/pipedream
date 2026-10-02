import app from "../../linkup.app.mjs";

function parseDate(value, label) {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid ${label}: \`${value}\`. Use the \`YYYY-MM-DD\` format.`);
  }
  return date;
}

export default {
  name: "Linkup Search",
  description: "Search and retrieve insights using the Linkup API. [See the documentation](https://docs.linkup.so/pages/documentation/endpoints/search/reference)",
  key: "linkup-search",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    outputType: {
      type: "string",
      label: "Output Type",
      description: "The type of output you want to get. Use `structured` for a custom-formatted response defined by `structuredOutputSchema`",
      options: [
        {
          value: "sourcedAnswer",
          label: "Natural language answer and its sources",
        },
        {
          value: "searchResults",
          label: "Raw context",
        },
        {
          value: "structured",
          label: "Json format of the response",
        },
      ],
      reloadProps: true,
    },
    structuredOutputSchema: {
      type: "string",
      label: "Structured Output Schema",
      description: "Schema for structured output (only applicable if Output Type is 'structured'). Provide a JSON schema (as a string) representing the desired response format.",
      optional: true,
      hidden: true,
    },
    includeImages: {
      type: "boolean",
      label: "Include Images",
      description: "Defines whether the API should include images in its results",
      optional: true,
    },
    includeDomains: {
      propDefinition: [
        app,
        "includeDomains",
      ],
    },
    excludeDomains: {
      propDefinition: [
        app,
        "excludeDomains",
      ],
    },
    fromDate: {
      propDefinition: [
        app,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        app,
        "toDate",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
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
    const fromDate = parseDate(this.fromDate, "From Date");
    const toDate = parseDate(this.toDate, "To Date");
    try {
      const response = await this.app.search({
        query: this.query,
        depth: this.depth,
        outputType: this.outputType,
        structuredOutputSchema:
          this.structuredOutputSchema && JSON.parse(this.structuredOutputSchema),
        includeImages: this.includeImages,
        includeDomains: this.includeDomains,
        excludeDomains: this.excludeDomains,
        fromDate,
        toDate,
        maxResults: this.maxResults,
      });
      $.export("$summary", "Successfully completed search query");
      return response;
    } catch (error) {
      console.error("Error calling Linkup API:", error);
      throw new Error(`Failed to fetch data from Linkup API: ${error.message}`);
    }
  },
};
