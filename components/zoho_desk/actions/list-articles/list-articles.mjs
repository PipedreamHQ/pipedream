import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-articles",
  name: "List Articles",
  description: "Lists knowledge base articles for a help center. [See the docs here](https://desk.zoho.com/portal/APIDocument.do#KnowledgeBase#KnowledgeBase_Listarticles)",
  type: "action",
  version: "0.0.1",
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
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Filter by the ID(s) of the categories the articles belong to. Use comma-separated IDs to include multiple categories.",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort articles by the specified attribute.",
      optional: true,
      options: [
        "createdTime",
        "modifiedTime",
        "likeCount",
        "viewCount",
        "unlikeCount",
      ],
      default: "createdTime",
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Filter articles by a tag.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of articles to return. Leave blank to return all available results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      portalId,
      categoryId,
      sortBy,
      tag,
      maxResults,
    } = this;

    const params = {
      portalId,
      categoryId,
      sortBy,
      tag,
    };

    const articles = [];
    const stream = this.zohoDesk.listKnowledgeBaseArticlesStream({
      params,
    });
    for await (const article of stream) {
      articles.push(article);
      if (maxResults && articles.length >= maxResults) {
        break;
      }
    }

    $.export("$summary", `Retrieved ${articles.length} article${articles.length === 1
      ? ""
      : "s"}.`);

    return articles;
  },
};
