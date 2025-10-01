import botpenguin from "../../botpenguin.app.mjs";

export default {
  key: "botpenguin-send-whatsapp-message",
  name: "Send WhatsApp Message",
  description: "Sends a WhatsApp message. [See the documentation](https://help.botpenguin.com/api-references/whatsapp-cloud-api/post-send-message-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    botpenguin,
    apiKey: {
      type: "string",
      label: "Api Key",
      description: "The bot's api key [Click here for further information](https://help.botpenguin.com/api-references/whatsapp-cloud-api#id-2.-api-key).",
      secret: true,
    },
    userName: {
      type: "string",
      label: "Username",
      description: "The name of the user to whom the message is being sent.",
      optional: true,
    },
    waId: {
      type: "string",
      label: "Wa Id",
      description: "The WhatsApp number of the user to whom the message is being sent. The number must contain the country code without the plus sign.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message that needs to sent.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.botpenguin.sendMessage({
      $,
      data: {
        userName: this.userName,
        wa_id: this.waId,
        type: "text",
        message: {
          text: this.message,
        },
      },
      params: {
        apiKey: this.apiKey,
      },
      headers: {
        apiKey: this.apiKey,
      },
    });
    $.export("$summary", "Message successfully sent!");
    return response;
  },
};
