import serenity_ai_hub from "../../serenity_ai_hub.app.mjs";

export default {
  key: "serenity_ai_hub-list-agent-code-options",
  name: "List Agent Code Options",
  description: "Retrieves available options for the Agent Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    serenity_ai_hub,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await serenity_ai_hub.propDefinitions.agentCode.options
      .call(this.serenity_ai_hub, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
