import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-search-articles",
  name: "Search Articles",
  description: "Searches for knowledge base articles. [See the docs here](https://desk.zoho.com/portal/APIDocument.do#KnowledgeBase_Searcharticles)",
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
    searchStr: {
      type: "string",
      label: "Search String",
      description: "The keywords to search for within articles.",
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Filter by articles belonging to the specified category.",
      optional: true,
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
      type: "integer",
      label: "Max Results",
      description: "Maximum number of articles to return. Leave blank to return all available matches.",
      optional: true,
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

    const articles = [];
    const stream = this.zohoDesk.searchKnowledgeBaseArticlesStream({
      params,
    });
    for await (const article of stream) {
      articles.push(article);
      if (maxResults && articles.length >= maxResults) {
        break;
      }
    }

    $.export("$summary", `Found ${articles.length} article${articles.length === 1
      ? ""
      : "s"}.`);

    return articles;
  },
};
