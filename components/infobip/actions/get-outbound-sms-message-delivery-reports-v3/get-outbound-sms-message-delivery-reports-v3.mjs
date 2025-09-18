import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-get-outbound-sms-message-delivery-reports-v3",
  name: "Get Outbound SMS Message Delivery Reports V3",
  description:
    "Get outbound SMS message delivery reports If you are unable to receive real-time message delivery reports towards your endpoint for various reasons, we offer you an API method to fetch batches of m... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.getOutboundSmsMessageDeliveryReportsV3({ $ });

    $.export(
      "$summary",
      `Data retrieved successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
