import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-delete-solution-article",
  name: "Delete Solution Article",
  description: "Delete a solution article in Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#solution_article_attributes)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.freshdesk.deleteArticle({
      $,
      articleId: this.articleId,
    });
    $.export("$summary", `Successfully deleted solution article ${this.articleId}`);
    return response;
  },
};
