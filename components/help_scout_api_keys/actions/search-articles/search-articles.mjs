import helpscout from "../../help_scout_api_keys.app.mjs";

export default {
  key: "help_scout_api_keys-search-articles",
  name: "Search Articles",
  description: "Search for articles by keyword. [See the documentation](https://developer.helpscout.com/docs-api/articles/search/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    helpscout,
    query: {
      type: "string",
      label: "Query",
      description: "The keyword to search for",
    },
    collectionId: {
      propDefinition: [
        helpscout,
        "collectionId",
      ],
      optional: true,
    },
    siteId: {
      propDefinition: [
        helpscout,
        "siteId",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        helpscout,
        "status",
      ],
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The visibility of the articles to search for",
      options: [
        "all",
        "public",
        "private",
      ],
      optional: true,
    },
    page: {
      propDefinition: [
        helpscout,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.helpscout.searchArticles({
      $,
      params: {
        query: this.query,
        collectionId: this.collectionId,
        siteId: this.siteId,
        status: this.status,
        visibility: this.visibility,
        page: this.page,
      },
    });
    $.export("$summary", `Found ${response.articles.items.length} article${response.articles.items.length === 1
      ? ""
      : "s"}.`);
    return response;
  },
};
