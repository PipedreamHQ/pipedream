import common from "../common/base.mjs";

export default {
  ...common,
  name: "Solution Article Updated",
  version: "0.0.1",
  key: "freshservice-solution-article-updated",
  description: "Emit new event for each updated solution article. [See documentation](https://api.freshservice.com/#view_all_solution_article)",
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
    getTsField() {
      return "updated_at";
    },
    getResourceKey() {
      return "articles";
    },
    generateMeta(article) {
      const ts = Date.parse(article.updated_at);
      return {
        id: `${article.id}-${ts}`,
        summary: `Updated solution article with ID ${article.id}`,
        ts,
      };
    },
  },
};
