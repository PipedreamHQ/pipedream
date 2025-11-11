import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-get-article",
  name: "Get Article",
  description: "Get an article from Dixa. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Knowledge/#tag/Knowledge/operation/getKnowledgeArticlesArticleid)",
  version: "0.0.1",
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
      description: "The ID of the article to get",
    },
  },
  async run({ $ }) {
    const response = await this.dixa.getArticle({
      articleId: this.articleId,
      $,
    });
    $.export("$summary", `Successfully retrieved article with ID ${this.articleId}`);
    return response;
  },
};
