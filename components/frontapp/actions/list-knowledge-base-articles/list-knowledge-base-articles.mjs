import frontapp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-knowledge-base-articles",
  name: "List Knowledge Base Articles",
  description: "List articles in a knowledge base. [See the documentation](https://dev.frontapp.com/reference/list-articles-in-a-knowledge-base)",
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
    maxResults: {
      propDefinition: [
        frontapp,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const articles = [];

    for await (const article of this.frontapp.paginate({
      fn: this.frontapp.listKnowledgeBaseArticles,
      args: {
        knowledgeBaseId: this.knowledgeBaseId,
      },
      maxResults: this.maxResults,
    })) {
      articles.push(article);
    }

    $.export("$summary", `Successfully retrieved ${articles.length} articles from knowledge base ${this.knowledgeBaseId}`);

    return articles;
  },
};
