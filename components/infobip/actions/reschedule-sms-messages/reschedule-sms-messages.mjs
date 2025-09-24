import infobip from "../../infobip.app.mjs";

export default {
  key: "reschedule-sms-messages",
  name: "Reschedule SMS Messages",
  description:
    "Reschedule SMS messages Change the date and time of already [scheduled messages](https://www.infobip.com/docs/sms/sms-over-api#schedule-sms). To schedule a message, use the `sendAt` field when [sen... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
    bulkId: {
      type: "string",
      label: "Bulk Id",
      description: "bulkId parameter",
      optional: false,
    }
  },
  async run({ $ }) {
    const { infobip, bulkId, ...params } = this;

    const pathQuery = [];
    if (bulkId !== undefined && bulkId !== null) pathQuery.push({ name: "bulkId", value: bulkId.toString() });

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        pathQuery.push({ name: key, value: value.toString() });
      }
    });

    const response = await infobip.rescheduleSmsMessages({
      $,
      pathQuery: pathQuery.length > 0 ? pathQuery : undefined,
    });

    $.export(
      "$summary",
      `Update completed successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
