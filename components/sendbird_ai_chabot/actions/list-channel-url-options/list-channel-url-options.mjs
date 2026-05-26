import sendbird_ai_chabot from "../../sendbird_ai_chabot.app.mjs";

export default {
  key: "sendbird_ai_chabot-list-channel-url-options",
  name: "List Channel URL Options",
  description: "Retrieves available options for the Channel URL field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sendbird_ai_chabot,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await sendbird_ai_chabot.propDefinitions.channelUrl.options
      .call(this.sendbird_ai_chabot, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
