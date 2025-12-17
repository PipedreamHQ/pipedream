import { ConfigurationError } from "@pipedream/platform";
import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-articles",
  name: "List Articles",
  description: "Retrieves a list of articles. [See the documentation](https://developer.zendesk.com/api-reference/help_center/help-center-api/articles/#list-articles).",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zendesk,
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
      reloadProps: true,
    },
    limit: {
      propDefinition: [
        zendesk,
        "limit",
      ],
      description: "Maximum number of articles to return",
    },
  },
  async additionalProps(props) {
    props.locale.hidden = false;
    props.categoryId.hidden = false;
    props.sectionId.hidden = false;
    if (this.userId) {
      props.locale.hidden = true;
      props.categoryId.hidden = true;
      props.sectionId.hidden = true;
    }
    return {};
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
          : this.locale,
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
