import workflow_max from "../../workflow_max.app.mjs";

export default {
  key: "workflow_max-list-client-uuid-options",
  name: "List Client UUID Options",
  description: "Retrieves available options for the Client UUID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    workflow_max,
  },
  async run({ $ }) {
    const options = await workflow_max.propDefinitions.clientUuid.options.call(this.workflow_max);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
