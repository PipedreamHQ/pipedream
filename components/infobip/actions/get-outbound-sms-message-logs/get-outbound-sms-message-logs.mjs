import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-get-outbound-sms-message-logs",
  name: "Get Outbound SMS Message Logs",
  description:
    "Get outbound SMS message logs Use this method for displaying logs for example in the user interface. Available are the logs for the last 48 hours and you can only retrieve maximum of 1000 logs per ... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.getOutboundSmsMessageLogs({ $ });

    $.export(
      "$summary",
      `Data retrieved successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
