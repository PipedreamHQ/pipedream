import googleAds from "../../google_ads.app.mjs";

export default {
  key: "google_ads-list-user-lists",
  name: "List User Lists",
  description: "List user lists (audiences) for a customer account, including each list's ID, name, and type. Use this to find a valid Customer List ID for **Add Contact to Customer List by Email** or **Create Customer List** — for Customer Match uploads, only lists where `type` is `CRM_BASED` are supported. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v25/GoogleAdsService/Search?transport=rest)",
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
      description: "Partial match text for the user list name (e.g. `Newsletter` matches names containing \"Newsletter\"). Omit to return every user list on the account.",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = await this.googleAds.listUserLists({
      $,
      accountId: this.accountId,
      customerClientId: this.customerClientId,
      query: this.query,
    }) ?? [];
    const userLists = Array.isArray(results)
      ? results
      : [];
    $.export("$summary", `Successfully retrieved ${userLists.length} user list${userLists.length === 1
      ? ""
      : "s"}`);
    return userLists;
  },
};
