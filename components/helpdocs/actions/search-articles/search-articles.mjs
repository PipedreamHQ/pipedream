import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-search-articles",
  name: "Search Articles",
  description: "Search for articles in your HelpDocs knowledge base. [See the documentation](https://apidocs.helpdocs.io/article/If1U9NNUpT-searching-for-articles)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpdocs,
    query: {
      type: "string",
      label: "Query",
      description: "The search term string you'd like results for",
    },
    includePrivate: {
      type: "boolean",
      label: "Include Private",
      description: "Include articles with a private status in the results",
      optional: true,
    },
    includeDraft: {
      type: "boolean",
      label: "Include Draft",
      description: "Include articles with a draft status in the results",
      optional: true,
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "If you have multilingual enabled, this will be the ISO language code you're trying to search in (e.g. `fr`, `en`, etc.). If you don't send this we'll search in your account's default language.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "How many results you'd like to receive",
      max: 100,
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const { articles } = await this.helpdocs.searchArticles({
      $,
      data: {
        query: this.query,
        include_private: this.includePrivate,
        include_draft: this.includeDraft,
        language_code: this.languageCode,
        limit: this.limit,
      },
    });

    $.export("$summary", `Found ${articles.length} articles`);
    return articles;
  },
};
