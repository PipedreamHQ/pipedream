import openperplex from "../../openperplex.app.mjs";

export default {
  key: "openperplex-query-from-url",
  name: "Query From URL",
  description: "Queries content from a specific URL using Openperplex. [See the documentation](https://docs.openperplex.com/api-reference/endpoint/query-from-url)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    openperplex,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to search",
    },
    query: {
      propDefinition: [
        openperplex,
        "query",
      ],
    },
    responseLanguage: {
      propDefinition: [
        openperplex,
        "responseLanguage",
      ],
    },
    answerType: {
      propDefinition: [
        openperplex,
        "answerType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openperplex.queryFromUrl({
      $,
      params: {
        url: this.url,
        query: this.query,
        response_language: this.responseLanguage,
        answer_type: this.answerType,
      },
    });
    $.export("$summary", "Successfully performed search");
    return response;
  },
};
