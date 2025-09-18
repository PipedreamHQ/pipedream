import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-update-scheduled-sms-messages-status",
  name: "Update Scheduled SMS Messages Status",
  description:
    "Update scheduled SMS messages status Change the status or completely cancel sending of [scheduled messages](https://www.infobip.com/docs/sms/sms-over-api#schedule-sms). To schedule a message, use t... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.updateScheduledSmsMessagesStatus({ $ });

    $.export(
      "$summary",
      `Update completed successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
