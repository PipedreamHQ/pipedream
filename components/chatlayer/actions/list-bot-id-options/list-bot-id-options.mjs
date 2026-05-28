import chatlayer from "../../chatlayer.app.mjs";

export default {
  key: "chatlayer-list-bot-id-options",
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
    chatlayer,
  },
  async run({ $ }) {
    const options = await chatlayer.propDefinitions.botId.options.call(this.chatlayer);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
