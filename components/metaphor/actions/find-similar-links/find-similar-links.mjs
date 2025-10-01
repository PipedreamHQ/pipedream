import metaphor from "../../metaphor.app.mjs";

export default {
  key: "metaphor-find-similar-links",
  name: "Find Similar Links",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find similar links to the link provided. See the documentation](https://docs.metaphor.systems/reference/findsimilar)",
  type: "action",
  props: {
    metaphor,
    url: {
      propDefinition: [
        metaphor,
        "url",
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
  },
  async run({ $ }) {
    const {
      metaphor,
      ...data
    } = this;

    const response = await metaphor.findSimilarLinks({
      $,
      data,
    });

    $.export("$summary", `${response.results.length} result${response.results.length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return response;
  },
};
