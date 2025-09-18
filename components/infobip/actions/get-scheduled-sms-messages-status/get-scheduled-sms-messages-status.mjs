import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-get-scheduled-sms-messages-status",
  name: "Get Scheduled SMS Messages Status",
  description:
    "Get scheduled SMS messages status See the status of [scheduled messages](https://www.infobip.com/docs/sms/sms-over-api#schedule-sms). To schedule a message, use the `sendAt` field when [sending a m... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.getScheduledSmsMessagesStatus({ $ });

    $.export(
      "$summary",
      `Data retrieved successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
