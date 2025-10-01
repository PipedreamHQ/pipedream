import picky_assist from "../../picky_assist.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Send Message",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "picky_assist-send-message",
  description: "Sends a message. [See docs here](https://help.pickyassist.com/api-documentation-v2/push-api/sending-single-message-push)",
  type: "action",
  props: {
    picky_assist,
    application: {
      label: "Application",
      description: "Specify through which application the message need to sent.",
      type: "string",
      options: constants.APPLICATIONS,
    },
    globalMessageText: {
      label: "Global Message Text",
      description: "Global Message Text Message with emoji supported by whatsapp",
      type: "string",
    },
    globalMessageMedia: {
      label: "Global Message Media",
      description: "URL from we need to fetch the media",
      type: "string",
      optional: true,
    },
    priority: {
      label: "Priority",
      description: "This gives priority in the message queue. Default is `0`",
      type: "string",
      optional: true,
      options: constants.PRIORITY,
      default: "0",
    },
    phoneNumber: {
      label: "Phone Number",
      description: "Mobile Number with full country code *without 0 or +*. E.g. `55123456789`",
      type: "string",
    },
    messageText: {
      label: "MessageText",
      description: "Text Message with emoji supported by whatsapp",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.picky_assist.sendMessage({
      $,
      data: {
        application: this.application,
        globalmessage: this.globalMessageText,
        globalmedia: this.globalMessageMedia,
        priority: this.priority,
        data: [
          {
            number: this.phoneNumber,
            message: this.messageText,
          },
        ],
      },
    });

    if (response) {
      $.export("$summary", `Successfully sent message with ID ${response.data[0].msg_id}`);
    }

    return response;
  },
};
