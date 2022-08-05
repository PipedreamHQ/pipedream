import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-unsubscribe-lead-from-a-campaign",
  name: "Unsubscribe Lead From Campaign",
  description: "This action will unsubscribe a lead from all campaigns if he belongs to the specified campaign. [See the docs here](https://developer.lemlist.com/#unsubscribe-a-lead-from-a-campaign)",
  version: "0.0.1",
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
    email: {
      propDefinition: [
        lemlist,
        "email",
        (c) => ({
          campaignId: c.campaignId.value,
        }),
      ],
      async options({ campaignId }) {
        const leads = await this.listLeads({
          campaignId,
        });

        return leads.map((email) => ({
          label: email,
          value: email,
        }));
      },
    },
  },
  async run({ $ }) {
    const response = await this.lemlist.removeLeadFromACampaign({
      $,
      email: this.email,
      campaignId: this.campaignId.value,
    });

    $.export("$summary", `Successfully unsubscribed ${this.email} lead from ${this.campaignId.label} campaign!`);
    return response;
  },
};

