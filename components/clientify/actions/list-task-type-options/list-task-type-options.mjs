import clientify from "../../clientify.app.mjs";

export default {
  key: "clientify-list-task-type-options",
  name: "List Task Type Options",
  description: "Retrieves available options for the Task Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clientify,
  },
  async run({ $ }) {
    const options = await clientify.propDefinitions.taskType.options.call(this.clientify);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
