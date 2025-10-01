import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-get-article",
  name: "Get Article",
  description: "Retrieve a specific article from your HelpDocs knowledge base. [See the documentation](https://apidocs.helpdocs.io/article/lc6AVtLvrv-getting-a-single-article)",
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
  },
  async run({ $ }) {
    const { article } = await this.helpdocs.getArticle({
      $,
      articleId: this.articleId,
    });

    $.export("$summary", `Found article ${this.articleId}`);
    return article;
  },
};
