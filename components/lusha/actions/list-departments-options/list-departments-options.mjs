import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-list-departments-options",
  name: "List Contact Departments Options",
  description: "List the departments Lusha accepts in the `Contact Departments` filter of **Search Contacts** and **Search and Enrich Contacts**. Pass an option's `value` (e.g. `Sales`). Does not use credits. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-contacts)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lusha,
  },
  async run({ $ }) {
    const options = await this.lusha.listDepartmentOptions({
      $,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
