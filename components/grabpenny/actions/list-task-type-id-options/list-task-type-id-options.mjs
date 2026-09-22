import grabpenny from "../../grabpenny.app.mjs";

export default {
  key: "grabpenny-list-task-type-id-options",
  name: "List Task Type ID Options",
  description: "Retrieves available options for the Task Type ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    grabpenny,
  },
  async run({ $ }) {
    const options = await grabpenny.propDefinitions.taskTypeId.options.call(this.grabpenny);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
