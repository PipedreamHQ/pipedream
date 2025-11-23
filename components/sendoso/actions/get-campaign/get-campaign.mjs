import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-campaign",
  name: "Get Campaign",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve details about a specific campaign. [See the documentation](https://developer.sendoso.com/rest-api/reference/campaigns/get-campaign)",
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

    const response = await this.sendoso.getCampaign({
      $,
      campaignId,
    });

    $.export("$summary", `Successfully retrieved campaign ID: ${campaignId}`);
    return response;
  },
};

