import telegram_bot_api from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-list-commands-options",
  name: "List Commands Options",
  description: "Retrieves available options for the Commands field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    telegram_bot_api,
  },
  async run({ $ }) {
    const options = await telegram_bot_api.propDefinitions.commands.options
      .call(this.telegram_bot_api);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
