import metaphor from "../../metaphor.app.mjs";

export default {
  key: "metaphor-search",
  name: "Search",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Perform a search with a Metaphor prompt-engineered query and retrieve a list of relevant results. [See the documentation](https://docs.metaphor.systems/reference/search)",
  type: "action",
  props: {
    metaphor,
    query: {
      propDefinition: [
        metaphor,
        "query",
      ],
    },
    numResults: {
      propDefinition: [
        metaphor,
        "numResults",
      ],
      optional: true,
    },
    includeDomains: {
      propDefinition: [
        metaphor,
        "includeDomains",
      ],
      optional: true,
    },
    excludeDomains: {
      propDefinition: [
        metaphor,
        "excludeDomains",
      ],
      optional: true,
    },
    startCrawlDate: {
      propDefinition: [
        metaphor,
        "startCrawlDate",
      ],
      optional: true,
    },
    endCrawlDate: {
      propDefinition: [
        metaphor,
        "endCrawlDate",
      ],
      optional: true,
    },
    startPublishedDate: {
      propDefinition: [
        metaphor,
        "startPublishedDate",
      ],
      optional: true,
    },
    endPublishedDate: {
      propDefinition: [
        metaphor,
        "endPublishedDate",
      ],
      optional: true,
    },
    useAutoprompt: {
      propDefinition: [
        metaphor,
        "useAutoprompt",
      ],
    },
    type: {
      propDefinition: [
        metaphor,
        "type",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      metaphor,
      ...data
    } = this;

    const response = await metaphor.search({
      $,
      data,
    });

    $.export("$summary", `${response.results.length} result${response.results.length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return response;
  },
};
