import app from "../../darkmoon.app.mjs";

export default {
  key: "darkmoon-get-campaign",
  name: "Get Campaign",
  description: "Retrieve a Darkmoon pentest campaign by ID, including its status, target and the vulnerabilities found so far. Requires a Darkmoon Pro dashboard API. [See the documentation](https://github.com/ASCIT31/Dark-Moon)",
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
    const response = await this.app.getCampaign({
      $,
      campaignId: this.campaignId,
    });
    $.export("$summary", `Retrieved campaign ${this.campaignId}`);
    return response;
  },
};
