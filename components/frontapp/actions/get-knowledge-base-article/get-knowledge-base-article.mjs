import frontapp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-get-knowledge-base-article",
  name: "Get Knowledge Base Article",
  description: "Fetches a knowledge base article. [See the documentation](https://dev.frontapp.com/reference/get-a-knowledge-base-article)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    frontapp,
    knowledgeBaseId: {
      propDefinition: [
        frontapp,
        "knowledgeBaseId",
      ],
    },
    articleId: {
      propDefinition: [
        frontapp,
        "articleId",
        ({ knowledgeBaseId }) => ({
          knowledgeBaseId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const article = await this.frontapp.getKnowledgeBaseArticle({
      $,
      articleId: this.articleId,
    });

    $.export("$summary", `Successfully retrieved knowledge base article with ID: ${this.articleId}`);

    return article;
  },
};
