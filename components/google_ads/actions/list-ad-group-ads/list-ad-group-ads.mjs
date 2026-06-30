import googleAds from "../../google_ads.app.mjs";

export default {
  key: "google_ads-list-ad-group-ads",
  name: "List Ad Group Ads",
  description: "List ads within ad groups for a customer account. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
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
      description: "Filter ads by name (partial match).",
      optional: true,
    },
  },
  async run({ $ }) {
    const { results } = await this.googleAds.listAllAdGroupAds({
      $,
      accountId: this.accountId,
      customerClientId: this.customerClientId,
      query: this.query,
    });
    const ads = results ?? [];
    $.export(
      "$summary",
      `Successfully retrieved ${ads.length} ad group ad${ads.length === 1
        ? ""
        : "s"}.`,
    );
    return ads;
  },
};
