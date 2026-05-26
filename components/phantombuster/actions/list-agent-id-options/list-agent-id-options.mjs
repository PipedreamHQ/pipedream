import phantombuster from "../../phantombuster.app.mjs";

export default {
  key: "phantombuster-list-agent-id-options",
  name: "List Agent ID Options",
  description: "Retrieves available options for the Agent ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    phantombuster,
  },
  async run({ $ }) {
    const options = await phantombuster.propDefinitions.agentId.options.call(this.phantombuster);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
