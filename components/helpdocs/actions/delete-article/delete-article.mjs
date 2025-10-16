import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-delete-article",
  name: "Delete Article",
  description: "Delete an article from your HelpDocs knowledge base. [See the documentation](https://apidocs.helpdocs.io/article/0iyvUUh7py-deleting-an-article)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.helpdocs.deleteArticle({
      $,
      articleId: this.articleId,
    });

    $.export("$summary", `Deleted article ${this.articleId}`);
    return response;
  },
};
