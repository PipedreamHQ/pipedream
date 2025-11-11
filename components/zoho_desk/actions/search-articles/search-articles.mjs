import zohoDesk from "../../zoho_desk.app.mjs";
export default {
  key: "zoho_desk-search-articles",
  name: "Search Articles",
  description: "Searches for knowledge base articles. [See the documentation](https://desk.zoho.com/portal/APIDocument.do#KnowledgeBase_Searcharticles)",
  type: "action",
  version: "0.0.3",
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
    searchStr: {
      type: "string",
      label: "Search String",
      description: "The keywords to search for within articles.",
    },
    categoryId: {
      propDefinition: [
        zohoDesk,
        "categoryId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort the results by created time or relevance. Use `-createdTime` for descending order.",
      optional: true,
      options: [
        "createdTime",
        "relevance",
        "-createdTime",
      ],
      default: "relevance",
    },
    searchKeyWordMatch: {
      type: "string",
      label: "Match Type",
      description: "Specify how multiple search keywords must be matched in the results.",
      optional: true,
      options: [
        {
          label: "Results matching at least one keyword",
          value: "ANY",
        },
        {
          label: "Only results matching all keywords",
          value: "ALL",
        },
      ],
    },
    maxResults: {
      propDefinition: [
        zohoDesk,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      portalId,
      searchStr,
      categoryId,
      sortBy,
      searchKeyWordMatch,
      maxResults,
    } = this;

    const params = {
      portalId,
      searchStr,
      categoryId,
      sortBy,
      searchKeyWordMatch,
    };

    const stream = this.zohoDesk.searchKnowledgeBaseArticlesStream({
      params,
      max: maxResults,
    });
    const articles = [];
    for await (const article of stream) {
      articles.push(article);
    }

    $.export("$summary", `Found ${articles.length} article${articles.length === 1
      ? ""
      : "s"}.`);

    return articles;
  },
};
