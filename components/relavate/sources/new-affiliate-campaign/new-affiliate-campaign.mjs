import relavate from "../../relavate.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "source",
  key: "relavate-new-affiliate-campaign",
  name: "New Affiliate Campaign",
  description: "Emit new event when a new affiliate campaign is created.",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  props: {
    relavate,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const id = data.id;
      const summary = `New Affiliate Campaign: ${data.name}`;
      const ts = Date.now();
      return {
        id,
        summary,
        ts,
      };
    },
    _getPreviousCampaignId() {
      return this.db.get("previousCampaignId");
    },
    _setPreviousCampaignId(id) {
      this.db.set("previousCampaignId", id);
    },
  },
  async run() {
    const latestCampaign = await this.relavate.createAffiliateCampaign();

    const previousCampaignId = this._getPreviousCampaignId();

    if (!previousCampaignId) {
      this._setPreviousCampaignId(latestCampaign.id);
      console.log("First run, no event emitted.");
      return;
    }

    if (latestCampaign.id !== previousCampaignId) {
      const meta = this.generateMeta(latestCampaign);
      this.$emit(latestCampaign, meta);

      this._setPreviousCampaignId(latestCampaign.id);
    } else {
      console.log("No new campaign, no event emitted.");
    }
  },
};
