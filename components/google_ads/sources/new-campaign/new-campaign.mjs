import googleAds from "../../google-ads.app.mjs";

export default {
  key: "google_ads-new-campaign",
  name: "New Campaign Created",
  description: "Emits an event each time a new campaign is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    googleAds: {
      type: "app",
      app: "google_ads",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
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
    },
  },
  methods: {
    ...googleAds.methods,
  },
  hooks: {
    async deploy() {
      // Placeholder for initial fetch of campaigns if required
    },
  },
  async run() {
    const lastCampaignId = this.db.get("lastCampaignId") || 0;
    let newLastCampaignId = lastCampaignId;

    const campaigns = await this.googleAds.createCampaign({
      useGoogleAdsAs: this.useGoogleAdsAs,
      managedAccount: this.managedAccount,
    });

    for (const campaign of campaigns) {
      const campaignId = parseInt(campaign.id);
      if (campaignId > lastCampaignId) {
        this.$emit(campaign, {
          id: campaign.id.toString(),
          summary: `New Campaign: ${campaign.name}`,
          ts: campaign.creationDate
            ? Date.parse(campaign.creationDate)
            : Date.now(),
        });
        newLastCampaignId = Math.max(newLastCampaignId, campaignId);
      }
    }

    this.db.set("lastCampaignId", newLastCampaignId);
  },
};
