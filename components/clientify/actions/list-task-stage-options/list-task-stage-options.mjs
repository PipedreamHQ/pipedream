import clientify from "../../clientify.app.mjs";

export default {
  key: "clientify-list-task-stage-options",
  name: "List Task Stage Options",
  description: "Retrieves available options for the Task Stage field.",
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
    const options = await clientify.propDefinitions.taskStage.options.call(this.clientify);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
