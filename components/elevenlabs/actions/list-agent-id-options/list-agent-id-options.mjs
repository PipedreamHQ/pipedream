import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-list-agent-id-options",
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
    elevenlabs,
  },
  async run({ $ }) {
    const options = [];
    let context = {};
    do {
      const result = await elevenlabs.propDefinitions.agentId.options.call(this.elevenlabs, {
        prevContext: context,
      });
      options.push(...result.options);
      context = result.context;
    } while (context?.cursor);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
