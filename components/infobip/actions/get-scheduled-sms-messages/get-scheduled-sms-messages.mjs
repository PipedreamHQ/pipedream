import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "infobip-get-scheduled-sms-messages",
  name: "Get Scheduled SMS Messages",
  description:
    "Get scheduled SMS messages See all [scheduled messages](https://www.infobip.com/docs/sms/sms-over-api#schedule-sms) and their scheduled date and time. To schedule a message, use the `sendAt` field ... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip
  },
  async run({ $ }) {
    const { infobip, ...params } = this;

    const response = await infobip.getScheduledSmsMessages({ $ });

    $.export(
      "$summary",
      `Data retrieved successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
