import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-send-analytics",
  name: "Get Send Analytics",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve analytics data for sends. [See the documentation](https://sendoso.docs.apiary.io/#reference/analytics-reporting)",
  type: "action",
  props: {
    sendoso,
    startDate: {
      propDefinition: [
        sendoso,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        sendoso,
        "endDate",
      ],
    },
    groupId: {
      propDefinition: [
        sendoso,
        "groupId",
      ],
      optional: true,
      description: "Optional group ID to filter analytics.",
    },
  },
  async run({ $ }) {
    const {
      startDate,
      endDate,
      groupId,
    } = this;

    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (groupId) params.group_id = groupId;

    const response = await this.sendoso.getSendAnalytics({
      $,
      params,
    });

    const summaryParts = ["Successfully retrieved send analytics"];
    if (startDate || endDate) {
      summaryParts.push("for the specified date range");
    }
    if (groupId) {
      summaryParts.push(`(group ID: ${groupId})`);
    }
    $.export("$summary", summaryParts.join(" "));
    return response;
  },
};

