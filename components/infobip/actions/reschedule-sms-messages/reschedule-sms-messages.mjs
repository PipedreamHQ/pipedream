import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-reschedule-sms-messages",
  name: "Reschedule SMS Messages",
  description:
    "Reschedule SMS messages Change the date and time of already [scheduled messages](https://www.infobip.com/docs/sms/sms-over-api#schedule-sms). To schedule a message, use the `sendAt` field when [sen... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.rescheduleSmsMessages({ $ });

    $.export(
      "$summary",
      `Update completed successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
