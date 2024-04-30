import foursquare from "../../foursquare.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "foursquare-new-tip",
  name: "New Tip",
  description: "Emit new event when a user adds a new tip. [See the documentation](https://docs.foursquare.com/developer/reference/get-user-tips)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    foursquare,
    db: "$.service.db",
    userId: {
      propDefinition: [
        foursquare,
        "userId",
      ],
    },
    venueId: {
      propDefinition: [
        foursquare,
        "venueId",
      ],
    },
    keyword: {
      propDefinition: [
        foursquare,
        "keyword",
        (c) => ({
          optional: true,
        }),
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    isKeywordMatch(tipText) {
      if (!this.keyword) return true;
      return tipText.toLowerCase().includes(this.keyword.toLowerCase());
    },
  },
  async run() {
    const sinceId = this.db.get("sinceId") || 0;
    let maxId = sinceId;

    const tips = await this.foursquare.getUserTips({
      userId: this.userId,
      venueId: this.venueId,
    });

    const filteredTips = tips.filter((tip) => this.isKeywordMatch(tip.text));

    for (const tip of filteredTips) {
      const tipId = parseInt(tip.id, 10);
      if (tipId > sinceId) {
        this.$emit(tip, {
          id: tip.id,
          summary: tip.text,
          ts: Date.parse(tip.createdAt),
        });
        if (tipId > maxId) {
          maxId = tipId;
        }
      }
    }

    this.db.set("sinceId", maxId);
  },
};
