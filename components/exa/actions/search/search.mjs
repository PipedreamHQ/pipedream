import app from "../../exa.app.mjs";

export default {
  key: "exa-search",
  name: "Search",
  description: "Performs an intelligent web search. [See the documentation](https://docs.exa.ai/reference/search)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    category: {
      propDefinition: [
        app,
        "category",
      ],
    },
    numResults: {
      propDefinition: [
        app,
        "numResults",
      ],
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
    startCrawlDate: {
      propDefinition: [
        app,
        "startCrawlDate",
      ],
    },
    endCrawlDate: {
      propDefinition: [
        app,
        "endCrawlDate",
      ],
    },
    startPublishedDate: {
      propDefinition: [
        app,
        "startPublishedDate",
      ],
    },
    endPublishedDate: {
      propDefinition: [
        app,
        "endPublishedDate",
      ],
    },
    includeText: {
      propDefinition: [
        app,
        "includeText",
      ],
    },
    excludeText: {
      propDefinition: [
        app,
        "excludeText",
      ],
    },
    context: {
      propDefinition: [
        app,
        "context",
      ],
    },
    moderation: {
      propDefinition: [
        app,
        "moderation",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      query,
      type,
      numResults,
      category,
      includeDomains,
      excludeDomains,
      startCrawlDate,
      endCrawlDate,
      startPublishedDate,
      endPublishedDate,
      includeText,
      excludeText,
      context,
      moderation,
    } = this;

    const response = await app.search({
      $,
      data: {
        query,
        type,
        numResults,
        category,
        includeDomains,
        excludeDomains,
        startCrawlDate,
        endCrawlDate,
        startPublishedDate,
        endPublishedDate,
        includeText,
        excludeText,
        context,
        moderation,
      },
    });

    $.export("$summary", `Successfully performed search with ID \`${response.requestId}\`.`);
    return response;
  },
};
