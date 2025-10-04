import app from "../../listen_notes.app.mjs";

export default {
  key: "listen_notes-full-search",
  name: "Full Search",
  description: "Full-text search on episodes, podcasts, or curated lists of podcasts. [See the documentation](https://www.listennotes.com/api/docs/#get-api-v2-search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    sortByDate: {
      propDefinition: [
        app,
        "sortByDate",
      ],
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.fullSearch({
      $,
      params: {
        q: this.q,
        sort_by_date: this.sortByDate,
        type: this.type,
        language: this.language,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.results.length} results`);
    return response;
  },
};
