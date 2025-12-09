import helpscout from "../../help_scout_api_keys.app.mjs";

export default {
  key: "help_scout_api_keys-get-article",
  name: "Get Article",
  description: "Retrieve a single article by ID or number. [See the documentation](https://developer.helpscout.com/docs-api/articles/get/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    helpscout,
    collectionId: {
      propDefinition: [
        helpscout,
        "collectionId",
      ],
    },
    categoryId: {
      propDefinition: [
        helpscout,
        "categoryId",
        ({ collectionId }) => ({
          collectionId,
        }),
      ],
      optional: true,
    },
    articleId: {
      propDefinition: [
        helpscout,
        "articleId",
        ({
          collectionId, categoryId,
        }) => ({
          collectionId,
          categoryId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.helpscout.getArticle({
      $,
      articleId: this.articleId,
    });
    $.export("$summary", `Retrieved article ${this.articleId}`);
    return response;
  },
};
