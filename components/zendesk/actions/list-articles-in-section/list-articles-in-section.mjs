import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-articles-in-section",
  name: "List Articles in Section",
  description: "Lists all articles within a specific help center section. Useful after identifying relevant sections. [See the documentation](https://developer.zendesk.com/api-reference/help_center/help-center-api/articles/#list-articles).",
  type: "action",
  version: "0.1.0",
  props: {
    app,
    sectionId: {
      type: "integer",
      label: "Section ID",
      description: "The unique ID of the section to list articles from",
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale for the articles (e.g., 'en-us')",
      default: "en-us",
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
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
  },
  methods: {
    listArticlesInSection(args = {}) {
      const {
        sectionId,
        customSubdomain,
        params,
        ...otherArgs
      } = args;
      
      return this.app.makeRequest({
        path: `/help_center/sections/${sectionId}/articles`,
        customSubdomain,
        params,
        ...otherArgs,
      });
    },
  },
  async run({ $: step }) {
    const {
      sectionId,
      locale,
      sortBy,
      sortOrder,
      customSubdomain,
    } = this;

    const params = {};
    
    if (sortBy) {
      params.sort_by = sortBy;
    }
    if (sortOrder) {
      params.sort_order = sortOrder;
    }

    const response = await this.listArticlesInSection({
      step,
      sectionId,
      customSubdomain,
      params,
    });

    step.export("$summary", `Successfully retrieved ${response.articles?.length || 0} articles from section ${sectionId}`);
    return response;
  },
};