import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-get-outbound-sms-message-logs-v3",
  name: "Get Outbound SMS Message Logs V3",
  description:
    "Get outbound SMS message logs Use this method to obtain the logs associated with outbound messages. The available logs are limited to those generated in the last 48 hours, and you can retrieve a ma... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.getOutboundSmsMessageLogsV3({ $ });

    $.export(
      "$summary",
      `Data retrieved successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
