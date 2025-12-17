import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-get-article",
  name: "Get Article",
  description: "Retrieves the details of a knowledge base article. [See the documentation](https://desk.zoho.com/portal/APIDocument.do#KnowledgeBase_Getarticle)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
    portalId: {
      propDefinition: [
        zohoDesk,
        "portalId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    articleId: {
      propDefinition: [
        zohoDesk,
        "articleId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      portalId,
      articleId,
    } = this;

    const article = await this.zohoDesk.getKnowledgeBaseArticle({
      articleId,
      params: {
        portalId,
      },
    });

    $.export("$summary", `Fetched article ${article.title || articleId}.`);

    return article;
  },
};
