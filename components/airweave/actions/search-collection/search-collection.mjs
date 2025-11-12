import airweave from "../../airweave.app.mjs";

export default {
  key: "airweave-search-collection",
  name: "Search Collection",
  description: "Search across all data sources within a collection using semantic and keyword search. [See the documentation](https://docs.airweave.ai/api-reference/collections/search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    airweave,
    collectionId: {
      propDefinition: [
        airweave,
        "collectionId",
      ],
    },
    searchQuery: {
      propDefinition: [
        airweave,
        "searchQuery",
      ],
    },
    searchLimit: {
      propDefinition: [
        airweave,
        "searchLimit",
      ],
    },
    responseType: {
      propDefinition: [
        airweave,
        "responseType",
      ],
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip for pagination",
      optional: true,
      default: 0,
      min: 0,
    },
    recencyBias: {
      type: "string",
      label: "Recency Bias",
      description: "How much to weigh recency vs similarity (0-1). 0 = no recency effect; 1 = rank by recency only",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      query: this.searchQuery,
      limit: this.searchLimit,
      offset: this.offset,
    };

    if (this.responseType) {
      params.response_type = this.responseType;
    }

    if (this.recencyBias !== undefined) {
      params.recency_bias = parseFloat(this.recencyBias);
    }

    const response = await this.airweave.searchCollection(
      this.collectionId,
      params,
    );

    const resultCount = response.results?.length || 0;
    $.export("$summary", `Successfully searched collection "${this.collectionId}" and found ${resultCount} result(s)`);

    return response;
  },
};

