import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-resume-lead-from-all-campaigns",
  name: "Resume Lead From All Campaigns",
  description: "This action starts a specific lead using its email in all campaigns. [See the docs here](https://developer.lemlist.com/#resume-a-specific-lead-by-email)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    const response = await this.lemlist.pauseResumeLeadFromAllCampaigns({
      $,
      email: this.email,
      action: "start",
    });

    $.export("$summary", `Successfully resumed ${this.email} lead from all campaigns!`);
    return response;
  },
};

