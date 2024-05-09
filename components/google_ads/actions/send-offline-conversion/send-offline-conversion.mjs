import googleAds from "../../google-ads.app.mjs";

export default {
  key: "google_ads-send-offline-conversion",
  name: "Send Offline Conversion",
  description: "Sends event from customer systems to Google Ads to track offline conversions. [See the documentation](https://developers.google.com/google-ads/api/docs/conversions/upload-clicks)",
  version: "0.0.1",
  type: "action",
  props: {
    googleAds,
    useGoogleAdsAs: googleAds.propDefinitions.useGoogleAdsAs,
    managedAccount: googleAds.propDefinitions.managedAccount,
    conversionUserIdentifier: googleAds.propDefinitions.conversionUserIdentifier,
    conversionAction: googleAds.propDefinitions.conversionAction,
    timestamp: googleAds.propDefinitions.timestamp,
    consentForAdUserData: googleAds.propDefinitions.consentForAdUserData,
    consentForAdPersonalization: googleAds.propDefinitions.consentForAdPersonalization,
    value: googleAds.propDefinitions.value,
    currency: googleAds.propDefinitions.currency,
  },
  async run({ $ }) {
    const data = {
      useGoogleAdsAs: this.useGoogleAdsAs,
      managedAccount: this.managedAccount,
      conversionUserIdentifier: this.conversionUserIdentifier,
      conversionAction: this.conversionAction,
      timestamp: this.timestamp,
      consentForAdUserData: this.consentForAdUserData,
      consentForAdPersonalization: this.consentForAdPersonalization,
      value: this.value,
      currency: this.currency,
    };

    const response = await this.googleAds.trackOfflineConversion(data);

    $.export("$summary", `Successfully sent offline conversion event for conversion action ${this.conversionAction}`);
    return response;
  },
};
