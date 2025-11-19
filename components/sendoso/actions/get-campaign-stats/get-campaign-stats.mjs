import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-campaign-stats",
  name: "Get Campaign Statistics",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve statistics and metrics for a campaign. [See the documentation](https://sendoso.docs.apiary.io/#reference/campaign-management)",
  type: "action",
  props: {
    sendoso,
    campaignId: {
      propDefinition: [
        sendoso,
        "campaignId",
      ],
    },
    startDate: {
      propDefinition: [
        sendoso,
        "startDate",
      ],
      description: "Start date for statistics (YYYY-MM-DD format).",
      optional: true,
    },
    endDate: {
      propDefinition: [
        sendoso,
        "endDate",
      ],
      description: "End date for statistics (YYYY-MM-DD format). Must be after start date.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      campaignId,
      startDate,
      endDate,
    } = this;

    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await this.sendoso.getCampaignStats({
      $,
      campaignId,
      params,
    });

    $.export("$summary", `Successfully retrieved statistics for campaign ID: ${campaignId}`);
    return response;
  },
};

