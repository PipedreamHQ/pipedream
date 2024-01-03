import toneden from "../../toneden.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "toneden-new-ad-campaign-instant",
  name: "New Ad Campaign Created (Instant)",
  description: "Emits an event when a new ad campaign is created. [See the documentation](https://developers.toneden.io/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    toneden,
    db: "$.service.db",
    userId: {
      propDefinition: [
        toneden,
        "userId",
      ],
    },
    status: {
      propDefinition: [
        toneden,
        "status",
        (c) => ({
          status: c.status,
        }),
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...toneden.methods,
    _getAfter() {
      return this.db.get("after") ?? null;
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
  },
  hooks: {
    async deploy() {
      // Retrieve and emit the latest ad campaigns
      const campaigns = await this.toneden.paginate(this.toneden.getUserAdCampaigns, {
        userId: this.userId,
        status: this.status,
      });
      if (campaigns.length > 0) {
        const lastCampaign = campaigns[campaigns.length - 1];
        this._setAfter(lastCampaign.id);
        for (const campaign of campaigns.reverse()) {
          this.$emit(campaign, {
            id: campaign.id,
            summary: `New Ad Campaign: ${campaign.name}`,
            ts: Date.parse(campaign.created_at),
          });
        }
      }
    },
  },
  async run() {
    // Retrieve and emit new ad campaigns since the last run
    const after = this._getAfter();
    const campaigns = await this.toneden.paginate(this.toneden.getUserAdCampaigns, {
      userId: this.userId,
      status: this.status,
    });

    let newLastAfter = after;
    for (const campaign of campaigns) {
      if (after && campaign.id <= after) {
        continue;
      }
      this.$emit(campaign, {
        id: campaign.id,
        summary: `New Ad Campaign: ${campaign.name}`,
        ts: Date.parse(campaign.created_at),
      });
      newLastAfter = campaign.id;
    }

    if (newLastAfter !== after) {
      this._setAfter(newLastAfter);
    }
  },
};
