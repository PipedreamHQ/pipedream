import app from "../../viral_loops.app.mjs";

export default {
  name: "Get Campaign",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "viral_loops-get-campaign",
  description: "Get a campaign. [See documentation here](https://developers.viral-loops.com/reference/get_campaign)",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getCampaign({
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved campaign \`${response.campaignName}\``);
    }

    return response;
  },
};
