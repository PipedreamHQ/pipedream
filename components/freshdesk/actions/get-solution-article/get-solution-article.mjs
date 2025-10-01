import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-get-solution-article",
  name: "Get Solution Article",
  description: "Get a solution article in Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#solution_article_attributes)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    categoryId: {
      propDefinition: [
        freshdesk,
        "categoryId",
      ],
    },
    folderId: {
      propDefinition: [
        freshdesk,
        "folderId",
        (c) => ({
          categoryId: c.categoryId,
        }),
      ],
    },
    articleId: {
      propDefinition: [
        freshdesk,
        "articleId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk.getArticle({
      $,
      articleId: this.articleId,
    });
    $.export("$summary", `Successfully retrieved solution article ${this.articleId}`);
    return response;
  },
};
