import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-list-solution-articles",
  name: "List Solution Articles",
  description: "List all solution articles. [See the documentation](https://api.freshservice.com/#view_all_solution_article)",
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
  },
  async run({ $ }) {
    const { articles } = await this.freshservice.listSolutionArticles({
      $,
      params: {
        folder_id: this.solutionFolderId,
      },
    });
    $.export("$summary", `Successfully listed ${articles.length} solution articles`);
    return articles;
  },
};
