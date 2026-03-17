import { ConfigurationError } from "@pipedream/platform";
import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-articles",
  name: "List Articles",
  description: "Retrieves a list of articles. [See the documentation](https://developer.zendesk.com/api-reference/help_center/help-center-api/articles/#list-articles).",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zendesk,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "warning",
      content: "If a User ID is provided, you cannot provide a Category ID or Section ID.",
    },
    locale: {
      propDefinition: [
        zendesk,
        "locale",
      ],
      optional: true,
    },
    categoryId: {
      propDefinition: [
        zendesk,
        "articleCategoryId",
        ({ locale }) => ({
          locale,
        }),
      ],
      optional: true,
    },
    sectionId: {
      propDefinition: [
        zendesk,
        "sectionId",
        ({
          locale, categoryId,
        }) => ({
          locale,
          categoryId,
        }),
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        zendesk,
        "userId",
      ],
      optional: true,
    },
    limit: {
      propDefinition: [
        zendesk,
        "limit",
      ],
      description: "Maximum number of articles to return",
    },
  },
  async run({ $ }) {
    if ((this.categoryId && this.userId) || (this.sectionId && this.userId)) {
      throw new ConfigurationError("Providing a User ID, you cannot provide a Category ID or Section ID.");
    }

    const results = this.zendesk.paginate({
      fn: this.zendesk.listArticles,
      args: {
        $,
        categoryId: this.categoryId,
        sectionId: this.sectionId,
        userId: this.userId,
        locale: this.userId
          ? null
          : this.locale
            ? this.locale.toLowerCase()
            : undefined,
      },
      resourceKey: "articles",
      max: this.limit,
    });

    const articles = [];
    for await (const article of results) {
      articles.push(article);
    }

    $.export("$summary", `Successfully retrieved ${articles.length} article${articles.length === 1
      ? ""
      : "s"}`);

    return articles;
  },
};
