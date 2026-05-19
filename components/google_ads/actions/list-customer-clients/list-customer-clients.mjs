import googleAds from "../../google_ads.app.mjs";

export default {
  key: "google_ads-list-customer-clients",
  name: "List Customer Clients",
  description: "List all customer clients for a given account. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleAds,
    accountId: {
      propDefinition: [
        googleAds,
        "accountId",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for customer clients",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleAds.listCustomerClients({
      $,
      accountId: this.accountId,
      query: this.query,
    });
    $.export("$summary", `Successfully retrieved ${response.length} customer client${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
