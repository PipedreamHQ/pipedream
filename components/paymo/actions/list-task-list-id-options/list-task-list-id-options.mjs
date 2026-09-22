import paymo from "../../paymo.app.mjs";

export default {
  key: "paymo-list-task-list-id-options",
  name: "List Task List ID Options",
  description: "Retrieves available options for the Task List ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    paymo,
  },
  async run({ $ }) {
    const options = await paymo.propDefinitions.taskListId.options.call(this.paymo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
