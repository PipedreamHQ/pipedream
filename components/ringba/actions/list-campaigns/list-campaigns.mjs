import ringba from "../../ringba.app.mjs";

export default {
  key: "ringba-list-campaigns",
  name: "List Campaigns",
  description: "Retrieve active campaigns for the specified Ringba Account ID. Set Include Stats to true only when campaign statistics are needed because the response may be larger. [See the documentation](https://developers.ringba.com/)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ringba,
    accountId: ringba.propDefinitions.accountId,
    includeStats: ringba.propDefinitions.includeStats,
  },
  async run({ $ }) {
    const response = await this.ringba.listCampaigns({
      $,
      accountId: this.accountId,
      params: {
        includeStats: this.includeStats || undefined,
      },
    });

    const campaigns = Array.isArray(response)
      ? response
      : response?.campaigns;

    if (!Array.isArray(campaigns)) {
      throw new Error("Ringba returned an unexpected campaigns response.");
    }

    $.export("$summary", `Successfully retrieved ${campaigns.length} campaign${campaigns.length === 1
      ? ""
      : "s"}.`);

    return campaigns;
  },
};
