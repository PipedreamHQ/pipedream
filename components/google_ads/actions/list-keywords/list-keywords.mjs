import googleAds from "../../google_ads.app.mjs";

export default {
  key: "google_ads-list-keywords",
  name: "List Keywords",
  description: "List keyword criteria for a customer account. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
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
      description: "Filter keywords by text (partial match).",
      optional: true,
    },
  },
  async run({ $ }) {
    const { results } = await this.googleAds.listAllKeywords({
      $,
      accountId: this.accountId,
      customerClientId: this.customerClientId,
      query: this.query,
    });
    const keywords = results ?? [];
    $.export(
      "$summary",
      `Successfully retrieved ${keywords.length} keyword${keywords.length === 1
        ? ""
        : "s"}.`,
    );
    return keywords;
  },
};
