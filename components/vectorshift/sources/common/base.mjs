import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../vectorshift.app.mjs";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async emitEvent(maxResults = false) {
      const fn = this.getFunction();
      const { objects: response = [] } = await fn();

      if (response.length) {
        if (maxResults && (response.length > maxResults)) {
          response.length = maxResults;
        }
      }

      for (const item of response) {
        this.$emit(item, {
          id: item._id,
          summary: this.getSummary(item),
          ts: Date.parse(item.createdDate || new Date()),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
};
