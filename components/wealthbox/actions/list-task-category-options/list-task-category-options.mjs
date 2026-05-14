import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-list-task-category-options",
  name: "List Category Options",
  description: "Retrieves available options for the Category field.",
  version: "0.0.1",
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
