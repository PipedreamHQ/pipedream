import sendblue from "../../sendblue.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Send Message",
  version: "0.0.1",
  key: "sendblue-send-message",
  description: "Sends an iMessage or SMS to any enabled phone globally. [See docs here](https://sendblue.co/docs/outbound/#sending-imessages)",
  type: "action",
  props: {
    sendblue,
    number: {
      label: "Number",
      description: "The number of the recipient of the message. E.g. `+19998887777`",
      type: "string",
    },
    content: {
      label: "Content",
      description: "The content of the message",
      type: "string",
    },
    sendStyle: {
      label: "Send Style",
      description: "The style of delivery of the message",
      type: "string",
      options: constants.SEND_STYLES,
      default: "invisible",
    },
    mediaUrl: {
      label: "Media URL",
      description: "The URL of the image you want to send. E.g. `https://source.unsplash.com/random.png`",
      type: "string",
    },
    statusCallback: {
      label: "Status Callback URL",
      description: "The URL where you want to receive the status updates of the message. E.g. `https://example.com/message-status/1234abcd`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.sendblue.sendMessage({
      $,
      data: {
        number: this.number,
        content: this.content,
        send_style: this.sendStyle,
        media_url: this.mediaUrl,
        statusCallback: this.statusCallback,
      },
    });

    if (response) {
      $.export("$summary", `Successfully ${response.status.toLowerCase()} message with id ${response.message_handle}`);
    }

    return response;
  },
};
