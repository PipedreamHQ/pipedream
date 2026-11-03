import app from "../../darkmoon.app.mjs";

export default {
  key: "darkmoon-get-campaign-report",
  name: "Get Campaign Report",
  description: "Retrieve the generated report of a Darkmoon campaign. The `content` field holds the report body (markdown by default). A report that is not generated yet comes back as a placeholder starting with `# Report not found`. Requires a Darkmoon Pro dashboard API. [See the documentation](https://github.com/ASCIT31/Dark-Moon)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getCampaignReport({
      $,
      campaignId: this.campaignId,
    });
    const ready = Boolean(response?.content)
      && !response.content.startsWith("# Report not found");
    $.export("$summary", ready
      ? `Retrieved report for campaign ${this.campaignId}`
      : `Report for campaign ${this.campaignId} is not generated yet`);
    return response;
  },
};
