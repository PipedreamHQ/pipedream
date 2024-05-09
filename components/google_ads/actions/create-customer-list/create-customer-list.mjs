import googleAds from "../../google-ads.app.mjs";

export default {
  key: "google_ads-create-customer-list",
  name: "Create Customer List",
  description: "Creates a customer list in Google Ads Audience Manager. [See the documentation](https://developers.google.com/google-ads/api/docs/start)",
  version: "0.0.1",
  type: "action",
  props: {
    googleAds,
    useGoogleAdsAs: googleAds.propDefinitions.useGoogleAdsAs,
    managedAccount: googleAds.propDefinitions.managedAccount,
    name: googleAds.propDefinitions.name,
    description: {
      ...googleAds.propDefinitions.description,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleAds.createCustomerList({
      useGoogleAdsAs: this.useGoogleAdsAs,
      managedAccount: this.managedAccount,
      name: this.name,
      description: this.description,
    });

    $.export("$summary", `Successfully created customer list named ${this.name}`);
    return response;
  },
};
