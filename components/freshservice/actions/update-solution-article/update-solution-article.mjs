import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-update-solution-article",
  name: "Update Solution Article",
  description: "Update a solution article. [See the documentation](https://api.freshservice.com/#update_solution_article)",
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
    title: {
      type: "string",
      label: "Title",
      description: "The title of the solution article",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the solution article",
      optional: true,
    },
    articleType: {
      propDefinition: [
        freshservice,
        "solutionArticleType",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        freshservice,
        "solutionArticleStatus",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags of the solution article",
      optional: true,
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "The keywords of the solution article",
      optional: true,
    },
    reviewDate: {
      type: "string",
      label: "Review Date",
      description: "Date in future when this article would need to be reviewed again. E.g. `2020-03-29T16:44:26Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    const { article } = await this.freshservice.updateSolutionArticle({
      $,
      articleId: this.solutionArticleId,
      data: {
        title: this.title,
        description: this.description,
        folder_id: this.solutionFolderId,
        article_type: this.articleType,
        status: this.status,
        tags: this.tags,
        keywords: this.keywords,
        review_date: this.reviewDate,
      },
    });
    $.export("$summary", `Successfully updated solution article with ID ${article.id}`);
    return article;
  },
};
