import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-delete-lead-from-a-campaign",
  name: "Delete Lead From Campaign",
  description: "This action deletes a lead from a specific campaign. All information, including statistics, will be deleted. [See the docs here](https://developer.lemlist.com/#delete-a-lead-from-a-campaign)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lemlist,
    campaignId: {
      propDefinition: [
        lemlist,
        "campaignId",
      ],
      withLabel: true,
    },
    campaignEmail: {
      propDefinition: [
        lemlist,
        "campaignEmail",
        (c) => ({
          campaignId: c.campaignId.value,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lemlist.removeLeadFromACampaign({
      $,
      email: this.campaignEmail,
      campaignId: this.campaignId.value,
      params: {
        action: "remove",
      },
    });

    $.export("$summary", `Successfully removed ${this.campaignEmail} lead from ${this.campaignId.label} campaign!`);
    return response;
  },
};

