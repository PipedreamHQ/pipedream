import chaindesk from "../../chaindesk.app.mjs";

export default {
  key: "chaindesk-list-agent-id-options",
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
    chaindesk,
  },
  async run({ $ }) {
    const options = await chaindesk.propDefinitions.agentId.options.call(this.chaindesk, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
