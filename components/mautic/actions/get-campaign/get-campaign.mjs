import mautic from "../../mautic.app.mjs";

export default {
  key: "mautic-get-campaign",
  name: "Get Campaign",
  description: "Gets an individual campaign by ID. [See docs](https://developer.mautic.org/#get-campaign)",
  version: "0.2.0",
  type: "action",
  props: {
    mautic,
    campaignId: {
      propDefinition: [
        mautic,
        "campaignId",
      ],
      description: "ID of the campaign to get details.",
    },
  },
  async run({ $ }) {
    const response = await this.mautic.getCampaign({
      $,
      campaignId: this.campaignId,
    });
    $.export("$summary", "Successfully retrieved campaign");
    return response;
  },
};
