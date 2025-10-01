import app from "../../kickofflabs.app.mjs";

export default {
  name: "Remove Lead from Campaign",
  description: "Remove a lead from your campaign. [See the documentation](https://dev.kickofflabs.com/delete/).",
  key: "kickofflabs-remove-lead-from-campaign",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Email addresses of the leads to remove.",
    },
  },
  async run({ $ }) {
    const res = await this.app.removeLeadFromCampaign(this.emails, $);
    $.export("summary", "Request for delete lead(s) sent successfully");
    return res;
  },
};
