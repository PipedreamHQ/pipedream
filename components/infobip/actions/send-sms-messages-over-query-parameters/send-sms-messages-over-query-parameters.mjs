import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-send-sms-messages-over-query-parameters",
  name: "Send SMS Messages Over Query Parameters",
  description:
    "Send SMS message over query parameters All message parameters of the message can be defined in the query string. Use this method only if [Send SMS message](#channels/sms/send-sms-messages) is not a... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
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
    const { infobip, ...params } = this;

    const response = await infobip.sendSmsMessagesOverQueryParameters({ $ });

    $.export(
      "$summary",
      `Message sent successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
