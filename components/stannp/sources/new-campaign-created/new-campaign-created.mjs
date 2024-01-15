import { axios } from "@pipedream/platform";
import stannp from "../../stannp.app.mjs";

export default {
  key: "stannp-new-campaign-created",
  name: "New Campaign Created",
  description: "Emits an event when a new campaign is created in Stannp. [See the documentation](https://www.stannp.com/us/direct-mail-api/campaigns)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    stannp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(campaign) {
      return {
        id: campaign.id.toString(),
        summary: `New Campaign: ${campaign.name}`,
        ts: Date.parse(campaign.created),
      };
    },
  },
  hooks: {
    async deploy() {
      const { data: campaigns } = await this.stannp.listCampaigns();
      const mostRecentCampaigns = campaigns.sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 50);
      for (const campaign of mostRecentCampaigns) {
        const meta = this.generateMeta(campaign);
        this.$emit(campaign, meta);
      }
      this.db.set("lastCampaignId", mostRecentCampaigns.length > 0
        ? mostRecentCampaigns[0].id
        : null);
    },
  },
  async run() {
    const lastCampaignId = this.db.get("lastCampaignId") || 0;
    let maxCampaignId = lastCampaignId;
    let hasMore = true;
    let page = 1;

    while (hasMore) {
      const { data: campaigns } = await this.stannp.listCampaigns({
        page,
      });
      const newCampaigns = campaigns.filter((campaign) => campaign.id > lastCampaignId);

      if (newCampaigns.length === 0) {
        hasMore = false;
      } else {
        for (const campaign of newCampaigns) {
          const meta = this.generateMeta(campaign);
          this.$emit(campaign, meta);
          maxCampaignId = campaign.id > maxCampaignId
            ? campaign.id
            : maxCampaignId;
        }
        this.db.set("lastCampaignId", maxCampaignId);
        page++;
      }
    }
  },
};
