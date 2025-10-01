import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-get-solution-article",
  name: "Get Solution Article",
  description: "Get a solution article by ID. [See the documentation](https://api.freshservice.com/#view_solution_article)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const { article } = await this.freshservice.getSolutionArticle({
      $,
      articleId: this.solutionArticleId,
    });
    $.export("$summary", `Successfully fetched solution article with ID ${article.id}`);
    return article;
  },
};
