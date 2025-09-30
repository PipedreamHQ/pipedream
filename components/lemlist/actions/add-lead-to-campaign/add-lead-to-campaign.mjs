import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-add-lead-to-campaign",
  name: "Add Lead To A Campaign",
  description: "This action adds a lead in a specific campaign. If the lead doesn't exist, it'll be created, then inserted to the campaign. The creator of the lead is the campaign's sender [See the docs here](https://developer.lemlist.com/#add-a-lead-in-a-campaign)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    email: {
      propDefinition: [
        lemlist,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lemlist.addLeadToCampaign({
      $,
      campaignId: this.campaignId.value,
      email: this.email,
    });

    $.export("$summary", `Successfully added ${this.email} lead into ${this.campaignId.label} campaign!`);
    return response;
  },
};

