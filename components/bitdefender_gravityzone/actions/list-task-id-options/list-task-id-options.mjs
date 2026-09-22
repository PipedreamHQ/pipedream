import bitdefender_gravityzone from "../../bitdefender_gravityzone.app.mjs";

export default {
  key: "bitdefender_gravityzone-list-task-id-options",
  name: "List Task ID Options",
  description: "Retrieves available options for the Task ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bitdefender_gravityzone,
    page: {
      propDefinition: [
        bitdefender_gravityzone,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const options = await bitdefender_gravityzone.propDefinitions.taskId.options
      .call(this.bitdefender_gravityzone, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
