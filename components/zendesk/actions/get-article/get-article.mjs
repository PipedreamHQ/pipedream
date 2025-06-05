import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-get-article",
  name: "Get Article",
  description: "Retrieves the full content and metadata of a specific help center article by ID. [See the documentation](https://developer.zendesk.com/api-reference/help_center/help-center-api/articles/#show-article).",
  type: "action",
  version: "0.1.0",
  props: {
    app,
    articleId: {
      type: "integer",
      label: "Article ID",
      description: "The unique ID of the article to retrieve",
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale for the article (e.g., 'en-us')",
      default: "en-us",
      optional: true,
    },
    includeTranslations: {
      type: "boolean",
      label: "Include Translations",
      description: "Whether to include article translations in the response",
      default: false,
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
    getArticle(args = {}) {
      const {
        articleId,
        customSubdomain,
        params,
        ...otherArgs
      } = args;
      
      return this.app.makeRequest({
        path: `/help_center/articles/${articleId}`,
        customSubdomain,
        params,
        ...otherArgs,
      });
    },
  },
  async run({ $: step }) {
    const {
      articleId,
      locale,
      includeTranslations,
      customSubdomain,
    } = this;

    const params = {};
    
    if (includeTranslations) {
      params.include = "translations";
    }

    const response = await this.getArticle({
      step,
      articleId,
      customSubdomain,
      params,
    });

    step.export("$summary", `Successfully retrieved article: "${response.article?.title || 'Unknown'}"`);
    return response;
  },
};
// This code defines a Zendesk action to retrieve a specific help center article by its ID.