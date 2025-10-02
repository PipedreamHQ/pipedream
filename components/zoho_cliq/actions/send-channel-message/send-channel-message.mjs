import app from "../../zoho_cliq.app.mjs";

export default {
  name: "Send Channel Message",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "zoho_cliq-send-channel-message",
  description: "Send message to a channel. [See documentation](https://www.zoho.com/cliq/help/restapi/v2/#Post_Message_Channel)",
  type: "action",
  props: {
    app,
    channel: {
      propDefinition: [
        app,
        "channel",
        () => ({
          useName: true,
        }),
      ],
      label: "Channel Name",
      description: "The channel name",
    },
    text: {
      label: "Text",
      description: "The text message",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.app.sendChannelMessage({
      $,
      channelName: this.channel,
      data: {
        text: this.text,
        sync_message: true,
      },
    });

    if (response) {
      $.export("$summary", `Successfully sent message with ID ${response.message_id}`);
    }

    return response;
  },
};
