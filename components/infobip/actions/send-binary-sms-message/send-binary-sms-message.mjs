import infobip from "../../infobip.app.mjs";

export default {
  key: "send-binary-sms-message",
  name: "Send Binary SMS Message",
  description:
    "Send binary SMS message Send single or multiple binary messages to one or more destination address. The API response will not contain the final delivery status, use [Delivery Reports](https://www.i... [See the documentation](https://www.infobip.com/docs/sms)",
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

    const response = await infobip.sendBinarySmsMessage({
      $,
      data: {
        messages: [
          {
            destinations: [{ to: phoneNumber }],
            ...(from && { from }),
            text,
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
