import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-mark-lead-from-all-campaigns-as-interested",
  name: "Mark Lead From All Campaigns As Interested",
  description: "This action marks a specific lead as interested using its email in all campaigns.",
  version: "0.0.1",
  type: "action",
  props: {
    lemlist,
    email: {
      propDefinition: [
        lemlist,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lemlist.markInterestedLeadInAllCampaigns({
      $,
      email: this.email,
    });

    $.export("$summary", `Successfully added ${this.email} lead as interested in all campaigns!`);
    return response;
  },
};

