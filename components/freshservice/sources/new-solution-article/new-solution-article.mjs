import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Solution Article",
  version: "0.0.1",
  key: "freshservice-new-solution-article",
  description: "Emit new event for each created solution article. [See documentation](https://api.freshservice.com/#view_all_solution_article)",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    solutionCategoryId: {
      propDefinition: [
        common.props.freshservice,
        "solutionCategoryId",
      ],
    },
    solutionFolderId: {
      propDefinition: [
        common.props.freshservice,
        "solutionFolderId",
        (c) => ({
          solutionCategoryId: c.solutionCategoryId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.freshservice.listSolutionArticles;
    },
    getParams() {
      return {
        folder_id: this.solutionFolderId,
      };
    },
    getResourceKey() {
      return "articles";
    },
    generateMeta(article) {
      return {
        id: article.id,
        summary: `New solution article with ID ${article.id}`,
        ts: Date.parse(article.created_at),
      };
    },
  },
};
