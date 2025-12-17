import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-delete-solution-article",
  name: "Delete Solution Article",
  description: "Delete a solution article. [See the documentation](https://api.freshservice.com/#delete_solution_article)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshservice,
    solutionCategoryId: {
      propDefinition: [
        freshservice,
        "solutionCategoryId",
      ],
    },
    solutionFolderId: {
      propDefinition: [
        freshservice,
        "solutionFolderId",
        (c) => ({
          solutionCategoryId: c.solutionCategoryId,
        }),
      ],
    },
    solutionArticleId: {
      propDefinition: [
        freshservice,
        "solutionArticleId",
        (c) => ({
          solutionFolderId: c.solutionFolderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const article = await this.freshservice.deleteSolutionArticle({
      $,
      articleId: this.solutionArticleId,
    });
    $.export("$summary", `Successfully deleted solution article with ID ${this.solutionArticleId}`);
    return article;
  },
};
