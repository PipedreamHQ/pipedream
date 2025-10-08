import app from "../../kickofflabs.app.mjs";

export default {
  name: "Get Campaign Status",
  description: "Fetches campaign overview stats. [See the documentation](https://dev.kickofflabs.com/stats/).",
  key: "kickofflabs-get-campaign-status",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const res = await this.app.getCampaignStatus($);
    $.export("summary", "Campaign status successfully fetched");
    return res;
  },
};
