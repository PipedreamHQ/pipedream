import twitter from "../../twitter.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    twitter,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Twitter API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getPreviousIds() {
      return this.db.get("previousIds") || [];
    },
    _setPreviousIds(previousIds) {
      this.db.set("previousIds", previousIds);
    },
  },
  async run() {
    const previousIds = this._getPreviousIds();
    const followedItems = await this.getFollowed();
    for (const item of followedItems.reverse()) {
      if (previousIds.includes(item.id)) {
        continue;
      }
      previousIds.push(item.id);
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
    this._setPreviousIds(previousIds);
  },
};
