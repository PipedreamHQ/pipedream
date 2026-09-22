import retell_ai from "../../retell_ai.app.mjs";

export default {
  key: "retell_ai-list-agent-id-options",
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
    retell_ai,
  },
  async run({ $ }) {
    const options = await retell_ai.propDefinitions.agentId.options.call(this.retell_ai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
