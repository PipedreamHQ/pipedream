import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-list-solution-categories",
  name: "List Solution Categories",
  description: "List all solution categories. [See the documentation](https://api.freshservice.com/#view_all_solution_category)",
  version: "0.0.1",
  type: "action",
  props: {
    freshservice,
  },
  async run({ $ }) {
    const { categories } = await this.freshservice.listSolutionCategories({
      $,
    });
    $.export("$summary", `Successfully listed ${categories.length} solution categories`);
    return categories;
  },
};
