import { LinkupClient } from "linkup-sdk";
import app from "../../linkup.app.mjs";

export default {
  name: "Linkup Search",
  description: "Search and retrieve insights using the Linkup API.",
  key: "linkup_search",
  version: "0.0.1",
  type: "action",
  props: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Your API Key for the Linkup API.",
      secret: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search query for Linkup.",
    },
    depth: {
      type: "string",
      label: "Search Depth",
      description: "Specify the depth of the search.",
    },
    outputType: {
      type: "string",
      label: "Output Type",
      description: "The format of the search results.",
    },
    structuredOutputSchema: {
      type: "string",
      label: "Structured Output Schema",
      description: "Schema for structured output (only applicable if Output Type is 'structured').",
      optional: true,
    },
  },
  async run({
    query, depth, outputType, structuredOutputSchema,
  }) {
    const apiKey = app.getApiKey();

    const client = new LinkupClient({
      apiKey,
    });
    const params = {
      query: query,
      depth: depth,
      outputType: outputType,
    };

    if (outputType === "structured" && structuredOutputSchema) {
      params.structuredOutputSchema = structuredOutputSchema;
    }
    try {
      const response = await client.search(params);

      return response;
    } catch (error) {
      console.error("Error calling Linkup API:", error);
      throw new Error(`Failed to fetch data from Linkup API: ${error.message}`);
    }
  },
};
