import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-list-task-category-options",
  name: "List Category Options",
  description: "List the task categories configured in Wealthbox (e.g. `Follow Up`, `Meeting`, `Review`) so agents and users can discover valid category IDs to pass to the Category prop in **Create Task**. Returns objects with `label` (category name) and `value` (numeric category ID). [See the documentation](http://dev.wealthbox.com/#tasks-collection-get)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wealthbox,
  },
  async run({ $ }) {
    const options = await wealthbox.propDefinitions.taskCategory.options.call(this.wealthbox);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
