import rocket_chat from "../../rocket_chat.app.mjs";

export default {
  key: "rocket_chat-list-channel-id-options",
  name: "List Channel ID Options",
  description: "Retrieves available options for the Channel ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rocket_chat,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await rocket_chat.propDefinitions.channelId.options.call(this.rocket_chat, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
