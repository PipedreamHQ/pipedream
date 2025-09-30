import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-mark-lead-from-all-campaigns-as-notinterested",
  name: "Mark Lead From All Campaigns As Not Interested",
  description: "This action marks a specific lead as not interested using its email in all campaigns. [See the docs here](https://developer.lemlist.com/#mark-as-not-interested-a-specific-lead-by-email)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.lemlist.markLeadInAllCampaigns({
      $,
      email: this.email,
      action: "notinterested",
    });

    $.export("$summary", `Successfully added ${this.email} lead as not interested in all campaigns!`);
    return response;
  },
};

