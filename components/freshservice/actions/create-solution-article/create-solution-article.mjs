import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-create-solution-article",
  name: "Create Solution Article",
  description: "Create a solution article. [See the documentation](https://api.freshservice.com/#create_solution_article)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshservice,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the solution article",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the solution article",
    },
    categoryId: {
      propDefinition: [
        freshservice,
        "solutionCategoryId",
      ],
    },
    folderId: {
      propDefinition: [
        freshservice,
        "solutionFolderId",
        (c) => ({
          solutionCategoryId: c.categoryId,
        }),
      ],
    },
    status: {
      propDefinition: [
        freshservice,
        "solutionArticleStatus",
      ],
    },
    articleType: {
      propDefinition: [
        freshservice,
        "solutionArticleType",
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
    const { article } = await this.freshservice.createSolutionArticle({
      $,
      data: {
        title: this.title,
        description: this.description,
        folder_id: this.folderId,
        article_type: this.articleType,
        status: this.status,
        tags: this.tags,
        keywords: this.keywords,
        review_date: this.reviewDate,
      },
    });
    $.export("$summary", `Successfully created solution article with ID ${article.id}`);
    return article;
  },
};
