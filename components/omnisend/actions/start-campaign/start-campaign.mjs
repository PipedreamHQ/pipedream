import omnisend from "../../omnisend.app.mjs";

export default {
  key: "omnisend-start-campaign",
  name: "Start Campaign",
  description: "Starts a marketing campaign for selected subscribers. [See the documentation](https://api-docs.omnisend.com/reference/post_campaigns-campaignid-actions-start)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    omnisend,
    campaignId: {
      propDefinition: [
        omnisend,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.omnisend.startCampaign({
      $,
      campaignId: this.campaignId,
    });
    $.export("$summary", `Successfully started campaign with ID ${this.campaignId}`);
    return response;
  },
};
