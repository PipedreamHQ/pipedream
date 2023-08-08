import app from "../../zoho_campaigns.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  type: "source",
  key: "zoho_campaign-new-campaign",
  name: "New Campaign",
  description: "Emit new event when a new campaign is created.",
  version: "0.0.1",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _setStartIndex(startIndex) {
      this.db.set("startIndex", startIndex);
    },
    _getStartIndex() {
      return this.db.get("startIndex") || 0;
    },
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

      if (res.status === "error") {
        throw new Error(JSON.stringify(res));
      }

      if (res.recent_campaigns.length === 0) {
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
