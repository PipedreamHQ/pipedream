import infobip from "../../infobip.app.mjs";

export default {
  key: "infobip-send-whatsapp-text-message",
  name: "Send WhatsApp Text Message",
  description: "Sends a WhatsApp text message to a specified number. [See the documentation](https://www.infobip.com/docs/api#channels/whatsapp/send-whatsapp-text-message)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infobip,
    from: {
      propDefinition: [
        infobip,
        "from",
      ],
      description: "Registered WhatsApp sender number. Must be in international format and comply with [WhatsApp's requirements](https://www.infobip.com/docs/whatsapp/get-started#phone-number-what-you-need-to-know).",
    },
    to: {
      propDefinition: [
        infobip,
        "phoneNumber",
      ],
      description: "Message recipient number. Must be in international format.",
    },
    text: {
      propDefinition: [
        infobip,
        "text",
      ],
    },
    messageId: {
      propDefinition: [
        infobip,
        "messageId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      infobip,
      text,
      ...data
    } = this;

    const response = await infobip.sendWhatsappMessage({
      $,
      data: {
        content: {
          text,
        },
        ...data,
      },
    });
    $.export("$summary", response.status.description);
    return response;
  },
};
