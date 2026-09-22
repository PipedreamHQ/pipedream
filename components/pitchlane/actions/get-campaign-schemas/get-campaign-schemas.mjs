import pitchlane from "../../pitchlane.app.mjs";

export default {
  key: "pitchlane-get-campaign-schemas",
  name: "Get Campaign Schemas",
  description: "Retrieve the variable schema and lead schema mapping for a specific campaign. [See the documentation](https://docs.pitchlane.com/reference#tag/campaigns/GET/campaigns/{campaignId}/schemas)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pitchlane,
    campaignId: {
      propDefinition: [
        pitchlane,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pitchlane.getCampaignSchemas({
      $,
      campaignId: this.campaignId,
    });
    $.export("$summary", `Successfully retrieved the variable schema and lead schema mapping for campaign ID: ${this.campaignId}`);
    return response;
  },
};
