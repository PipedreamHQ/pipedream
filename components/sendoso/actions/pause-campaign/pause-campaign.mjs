import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-pause-campaign",
  name: "Pause Campaign",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Pause an active campaign. [See the documentation](https://sendoso.docs.apiary.io/#reference/campaign-management)",
  type: "action",
  props: {
    sendoso,
    campaignId: {
      propDefinition: [
        sendoso,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    const { campaignId } = this;

    const response = await this.sendoso.pauseCampaign({
      $,
      campaignId,
    });

    $.export("$summary", `Successfully paused campaign ID: ${campaignId}`);
    return response;
  },
};

