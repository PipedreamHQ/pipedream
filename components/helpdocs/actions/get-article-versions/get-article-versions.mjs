import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-get-article-versions",
  name: "Get Article Versions",
  description: "Retrieve version history and details for a specific article in your knowledge base. [See the documentation](https://apidocs.helpdocs.io/article/c3svl5hvb2-getting-article-versions)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpdocs,
    articleId: {
      propDefinition: [
        helpdocs,
        "articleId",
      ],
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "Restrict returned articles to a language (e.g. `en`, `fr`, etc.)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.helpdocs.getArticleVersions({
      $,
      articleId: this.articleId,
      params: {
        language_code: this.languageCode,
      },
    });

    $.export("$summary", `Retrieved article versions for ${this.articleId}`);
    return response;
  },
};
