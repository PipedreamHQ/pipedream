import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-campaign-analytics",
  name: "Get Campaign Analytics",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve analytics data for campaigns. [See the documentation](https://sendoso.docs.apiary.io/#reference/analytics-reporting)",
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
    campaignId: {
      propDefinition: [
        sendoso,
        "campaignId",
      ],
      optional: true,
      description: "Optional campaign ID to filter analytics.",
    },
  },
  async run({ $ }) {
    const {
      startDate,
      endDate,
      campaignId,
    } = this;

    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (campaignId) params.campaign_id = campaignId;

    const response = await this.sendoso.getCampaignAnalytics({
      $,
      params,
    });

    $.export("$summary", `Successfully retrieved campaign analytics from ${startDate} to ${endDate}`);
    return response;
  },
};

