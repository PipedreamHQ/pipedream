import googleAds from "../../google-ads.app.mjs";

export default {
  key: "google_ads-create-report",
  name: "Create Report",
  description: "Generates a report for your Google Ads campaigns. [See the documentation](https://developers.google.com/google-ads/api/docs/reporting/overview)",
  version: "0.0.1",
  type: "action",
  props: {
    googleAds,
    useGoogleAdsAs: googleAds.propDefinitions.useGoogleAdsAs,
    managedAccount: googleAds.propDefinitions.managedAccount,
    resource: googleAds.propDefinitions.resource,
    dateRange: googleAds.propDefinitions.dateRange,
  },
  async run({ $ }) {
    const report = await this.googleAds.generateReport({
      useGoogleAdsAs: this.useGoogleAdsAs,
      managedAccount: this.managedAccount,
      resource: this.resource,
      dateRange: this.dateRange,
    });

    $.export("$summary", "Successfully generated report");
    return report;
  },
};
