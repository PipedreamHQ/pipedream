import liveagent from "../../liveagent.app.mjs";

export default {
  key: "liveagent-list-agent-id-options",
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
    liveagent,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await liveagent.propDefinitions.agentId.options.call(this.liveagent, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
