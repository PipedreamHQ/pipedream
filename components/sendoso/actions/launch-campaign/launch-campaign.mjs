import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-launch-campaign",
  name: "Launch Campaign",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Launch a campaign to make it active. [See the documentation](https://sendoso.docs.apiary.io/#reference/campaign-management)",
  type: "action",
  props: {
    sendoso,
    campaignId: {
      propDefinition: [
        sendoso,
        "campaignId",
      ],
    },
    launchDate: {
      type: "string",
      label: "Launch Date",
      description: "Optional launch date (YYYY-MM-DD). Launches immediately if not provided.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      campaignId,
      launchDate,
    } = this;

    const data = {};
    if (launchDate) data.launch_date = launchDate;

    const response = await this.sendoso.launchCampaign({
      $,
      campaignId,
      ...data,
    });

    $.export("$summary", `Successfully launched campaign ID: ${campaignId}`);
    return response;
  },
};

