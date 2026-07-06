import googleAds from "../../google_ads.app.mjs";

export default {
  key: "google_ads-list-campaign-shared-sets",
  name: "List Campaign Shared Sets",
  description: "List shared sets attached to campaigns for a customer account. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    googleAds,
    accountId: {
      propDefinition: [
        googleAds,
        "accountId",
      ],
    },
    customerClientId: {
      propDefinition: [
        googleAds,
        "customerClientId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Filter by campaign name or shared set name (partial match).",
      optional: true,
    },
  },
  async run({ $ }) {
    const { results } = await this.googleAds.listCampaignSharedSets({
      $,
      accountId: this.accountId,
      customerClientId: this.customerClientId,
      query: this.query,
    });
    const items = results ?? [];
    $.export(
      "$summary",
      `Successfully retrieved ${items.length} campaign shared set${items.length === 1
        ? ""
        : "s"}.`,
    );
    return items;
  },
};
