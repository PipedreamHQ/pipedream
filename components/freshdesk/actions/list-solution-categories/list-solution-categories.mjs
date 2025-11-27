import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-solution-categories",
  name: "List Solution Categories",
  description: "List solution categories in Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#solution_category_attributes)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
  },
  async run({ $ }) {
    const response = await this.freshdesk.listSolutionCategories({
      $,
    });
    $.export("$summary", `Successfully listed ${response.length} solution category${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
