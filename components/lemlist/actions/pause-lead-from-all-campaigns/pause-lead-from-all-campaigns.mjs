import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-pause-lead-from-all-campaigns",
  name: "Pause Lead From All Campaigns",
  description: "This action pauses a specific lead using its email in all campaigns. [See the docs here](https://developer.lemlist.com/#pause-a-specific-lead-by-email)",
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
      action: "pause",
    });

    $.export("$summary", `Successfully paused ${this.email} lead from all campaigns!`);
    return response;
  },
};

