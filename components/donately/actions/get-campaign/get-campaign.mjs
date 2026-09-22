import donately from "../../donately.app.mjs";

export default {
  key: "donately-get-campaign",
  name: "Get Campaign",
  description: "Get a campaign by ID. [See the documentation](https://developer.donate.ly/api/#campaigns)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    donately,
    campaignId: {
      propDefinition: [
        donately,
        "campaignId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.donately.getCampaign({
      $,
      campaignId: this.campaignId,
    });
    $.export("$summary", `Found campaign ${response?.data?.id}`);
    return response;
  },
};
