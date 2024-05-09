import googleAds from "../../google-ads.app.mjs";

export default {
  key: "google_ads-new-lead-form-entry-instant",
  name: "New Lead Form Entry (Instant)",
  description: "Emits an event for each new lead form entry.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    googleAds: {
      type: "app",
      app: "google_ads",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    useGoogleAdsAs: {
      propDefinition: [
        googleAds,
        "useGoogleAdsAs",
      ],
    },
    managedAccount: {
      propDefinition: [
        googleAds,
        "managedAccount",
        (c) => ({
          useGoogleAdsAs: c.useGoogleAdsAs,
        }),
      ],
      optional: true,
    },
    leadForm: {
      propDefinition: [
        googleAds,
        "leadForm",
        (c) => ({
          useGoogleAdsAs: c.useGoogleAdsAs,
          managedAccount: c.managedAccount,
        }),
      ],
    },
  },
  hooks: {
    async activate() {
      // Placeholder for webhook subscription code
      // Example: Subscribe to Google Ads lead form webhook
      // const subscriptionId = await this.googleAds.createWebhookSubscription({ leadForm });
      // this.db.set("subscriptionId", subscriptionId);
    },
    async deactivate() {
      // Placeholder for webhook unsubscription code
      // Example: Unsubscribe from Google Ads lead form webhook
      // const subscriptionId = this.db.get("subscriptionId");
      // await this.googleAds.deleteWebhookSubscription({ subscriptionId });
    },
  },
  async run(event) {
    const { body } = event;

    // Perform necessary validation and processing
    // Example: Verify signatures to ensure events are sent by Google Ads
    // and parse the event to extract necessary information.
    if (body && body.leadId) {
      this.$emit(body, {
        id: body.leadId,
        summary: `New lead from form: ${body.formId}`,
        ts: Date.now(), // Use event timestamp or current time
      });
    } else {
      this.http.respond({
        status: 400,
        body: "Invalid payload",
      });
    }
  },
};
