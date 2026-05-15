import botstar from "../../botstar.app.mjs";

export default {
  key: "botstar-list-bot-id-options",
  name: "List Bot ID Options",
  description: "Retrieves available options for the Bot ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    botstar,
  },
  async run({ $ }) {
    const options = await botstar.propDefinitions.botId.options.call(this.botstar);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
