import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-send-sms-message-over-query-parameters",
  name: "Send SMS Message Over Query Parameters",
  description:
    "Send SMS message over query parameters All message parameters of the message can be defined in the query string. Use this method only if [Send SMS message](#channels/sms/send-sms-message) is not an... [See the documentation](https://www.infobip.com/docs/sms)",
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

    const response = await infobip.sendSmsMessageOverQueryParameters({ $ });

    $.export(
      "$summary",
      `Message sent successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
