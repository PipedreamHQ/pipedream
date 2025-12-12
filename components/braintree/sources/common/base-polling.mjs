import braintree from "../../braintree.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    braintree,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _yesterday() {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return yesterday.toISOString();
    },
    _getLastCreatedAt() {
      return this.db.get("createdAt") || this._yesterday();
    },
    _setLastCreatedAt(lastCreatedAt) {
      this.db.set("createdAt", lastCreatedAt);
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
    generateMeta(result) {
      return {
        id: result.id,
        summary: this.getSummary(result),
        ts: Date.parse(result.createdAt),
      };
    },
    getResults() {
      throw new ConfigurationError("getResults is not implemented");
    },
    getSummary() {
      throw new ConfigurationError("getSummary is not implemented");
    },
  },
  async run() {
    const lastCreatedAt = this._getLastCreatedAt();
    let maxCreatedAt = lastCreatedAt;

    const results = await this.getResults(lastCreatedAt);
    for (const result of results) {
      const createdAt = result.createdAt;
      this.emitEvent(result);
      if (Date.parse(createdAt) > Date.parse(maxCreatedAt)) {
        maxCreatedAt = createdAt;
      }
    }

    this._setLastCreatedAt(maxCreatedAt);
  },
};
