import googleAds from "../../google_ads.app.mjs";

export default {
  key: "google_ads-list-bidding-strategies",
  name: "List Bidding Strategies",
  description: "List portfolio bidding strategies for a customer account. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
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
      description: "Filter by bidding strategy name (partial match).",
      optional: true,
    },
  },
  async run({ $ }) {
    const { results } = await this.googleAds.listAllBiddingStrategies({
      $,
      accountId: this.accountId,
      customerClientId: this.customerClientId,
      query: this.query,
    });
    const items = results ?? [];
    $.export(
      "$summary",
      `Successfully retrieved ${items.length} bidding strateg${items.length === 1
        ? "y"
        : "ies"}.`,
    );
    return items;
  },
};
