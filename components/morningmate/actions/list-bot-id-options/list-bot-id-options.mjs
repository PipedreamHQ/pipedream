import morningmate from "../../morningmate.app.mjs";

export default {
  key: "morningmate-list-bot-id-options",
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
    morningmate,
  },
  async run({ $ }) {
    const options = await morningmate.propDefinitions.botId.options.call(this.morningmate);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
