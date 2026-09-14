import infobip from "../../infobip.app.mjs";

export default {
  key: "send-sms-messages",
  name: "Send SMS message",
  description:
    "Send SMS message With this API method, you can do anything from sending a basic message to one person, all the way to sending customized messages to thousands of recipients in one go. It comes with... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
    phoneNumber: {
      propDefinition: [infobip, "phoneNumber"],
      optional: false,
    },
    text: {
      propDefinition: [infobip, "text"],
      optional: false,
    },
    from: {
      propDefinition: [infobip, "from"],
      optional: true,
    },
    applicationId: {
      propDefinition: [infobip, "applicationId"],
      optional: true,
    },
    entityId: {
      propDefinition: [infobip, "entityId"],
      optional: true,
    }
  },
  async run({ $ }) {
    const { infobip, phoneNumber, text, from, applicationId, entityId, ...params } = this;

    const response = await infobip.sendSmsMessages({
      $,
      data: {
        messages: [
          {
            ...(from && { sender: from }),
            destinations: [{ to: phoneNumber }],
            content: { text },
            ...(applicationId && { applicationId }),
            ...(entityId && { entityId }),
          },
        ],
        ...params,
      },
    });

    $.export(
      "$summary",
      `Message sent successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
