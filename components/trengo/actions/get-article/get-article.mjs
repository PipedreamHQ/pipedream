import app from "../../trengo.app.mjs";

export default {
  key: "trengo-get-article",
  name: "Get Article",
  description: "Get a specific article. [See the documentation](https://developers.trengo.com/reference/get-an-article)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    helpCenterId: {
      propDefinition: [
        app,
        "helpCenterId",
      ],
    },
    articleId: {
      propDefinition: [
        app,
        "articleId",
        ({ helpCenterId }) => ({
          helpCenterId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getArticle({
      $,
      helpCenterId: this.helpCenterId,
      articleId: this.articleId,
    });
    $.export("$summary", "Successfully retrieved article");
    return response;
  },
};
