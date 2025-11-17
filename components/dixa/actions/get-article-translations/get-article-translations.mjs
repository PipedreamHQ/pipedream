import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-get-article-translations",
  name: "Get Article Translations",
  description: "Get the translations of an article from Dixa. [See the documentation](https://docs.dixa.io/openapi/dixa-api/beta/tag/Knowledge/#tag/Knowledge/operation/getKnowledgeArticlesArticleidTranslations)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dixa,
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The ID of the article to get translations for",
    },
  },
  async run({ $ }) {
    const response = await this.dixa.getArticleTranslations({
      articleId: this.articleId,
      $,
    });
    $.export("$summary", `Successfully retrieved translations for article with ID ${this.articleId}`);
    return response;
  },
};
