import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-get-outbound-sms-message-delivery-reports",
  name: "Get Outbound SMS Message Delivery Reports",
  description:
    "Get outbound SMS message delivery reports If you are for any reason unable to receive real-time delivery reports on your endpoint, you can use this API method to learn if and when the message has b... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.getOutboundSmsMessageDeliveryReports({ $ });

    $.export(
      "$summary",
      `Data retrieved successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
