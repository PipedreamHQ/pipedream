import openperplex from "../../openperplex.app.mjs";

export default {
  key: "openperplex-simple-search",
  name: "Simple Search",
  description: "Perform a simple search using Openperplex. [See the documentation](https://docs.openperplex.com/api-reference/endpoint/search-simple)",
  version: "0.0.1",
  type: "action",
  props: {
    openperplex,
    query: {
      propDefinition: [
        openperplex,
        "query",
      ],
    },
    dateContext: {
      type: "string",
      label: "Date Context",
      description: "A date for context. Format: `YYYY-MM-DD` or `YYYY-MM-DD HH:MM AM/PM`. If not provided, the API uses the current date.",
      optional: true,
    },
    location: {
      propDefinition: [
        openperplex,
        "location",
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
    const response = await this.openperplex.simpleSearch({
      $,
      params: {
        query: this.query,
        date_context: this.dateContext,
        location: this.location,
        response_language: this.responseLanguage,
        answer_type: this.answerType,
      },
    });
    $.export("$summary", "Successfully performed search");
    return response;
  },
};
