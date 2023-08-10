import common from "../common/common.mjs";

export default {
  ...common,
  type: "source",
  key: "zoho_campaigns-new-campaign",
  name: "New Campaign",
  description: "Emit new event when a new campaign is created.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    _emitEvent(campaign) {
      this.$emit(campaign, {
        id: campaign.campaign_key,
        summary: campaign.campaign_name,
        ts: campaign.created_time_gmt,
      });
    },
  },
  async run() {
    let page = 0;
    let startIndex = this._getStartIndex();

    while (true) {
      const res = await this.app.listRecentCampaigns(page, startIndex);

      if (res.status === "error" || res.recent_campaigns.length === 0) {
        break;
      }

      for (const campaign of res.recent_campaigns) {
        this._emitEvent(campaign);
      }
      startIndex += res.recent_campaigns.length;
      page++;
    }

    this._setStartIndex(startIndex);
  },
};
