import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-get-article",
  name: "Get Article",
  description: "Retrieves an article by its ID. [See the documentation](https://developer.zendesk.com/api-reference/help_center/help-center-api/articles/#show-article).",
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
    articleId: {
      propDefinition: [
        zendesk,
        "articleId",
        ({ locale }) => ({
          locale,
        }),
      ],
    },
  },
  async run({ $ }) {
    const article = await this.zendesk.getArticle({
      $,
      locale: this.locale,
      articleId: this.articleId,
    });

    $.export("$summary", `Successfully retrieved article ${this.articleId}`);
    return article;
  },
};
