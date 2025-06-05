import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-search-articles",
  name: "Search Articles",
  description: "Searches for help center knowledge base articles using Zendesk's Help Center API. Can search by keywords, filter by labels, and sort results. [See the documentation](https://developer.zendesk.com/api-reference/help_center/help-center-api/articles/#list-articles).",
  type: "action",
  version: "0.1.0",
  props: {
    app,
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "Keywords to search for in article titles and content",
      optional: true,
    },
    labelNames: {
      type: "string",
      label: "Label Names",
      description: "Comma-separated list of label names to filter by (e.g., 'photos,camera')",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort articles by specified field",
      options: [
        "position",
        "title", 
        "created_at",
        "updated_at",
        "edited_at",
      ],
      default: "position",
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Order of the results",
      options: [
        "asc",
        "desc",
      ],
      default: "asc",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale for the articles (e.g., 'en-us')",
      default: "en-us",
      optional: true,
    },
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
  },
  methods: {
    searchArticles(args = {}) {
      const {
        customSubdomain,
        params,
        ...otherArgs
      } = args;
      
      return this.app.makeRequest({
        path: `/help_center/articles`,
        customSubdomain,
        params,
        ...otherArgs,
      });
    },
  },
  async run({ $: step }) {
    const {
      searchQuery,
      labelNames,
      sortBy,
      sortOrder,
      locale,
      customSubdomain,
    } = this;

    const params = {};
    
    if (labelNames) {
      params.label_names = labelNames;
    }
    if (sortBy) {
      params.sort_by = sortBy;
    }
    if (sortOrder) {
      params.sort_order = sortOrder;
    }

    const response = await this.searchArticles({
      step,
      customSubdomain,
      params,
    });

    step.export("$summary", `Successfully found ${response.articles?.length || 0} articles`);
    return response;
  },
};
// This code defines a Pipedream action that allows users to search for articles in Zendesk's Help Center.