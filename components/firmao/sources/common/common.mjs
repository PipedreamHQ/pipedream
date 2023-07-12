import app from "../../firmao.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

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
    generateMeta(event) {
      const {
        id,
        creationDate,
      } = event;
      return {
        summary: this.getSummary(event),
        id,
        ts: +new Date(creationDate),
      };
    },
    getSummary() {
      throw new Error("getSummary not implemented");
    },
    async processEvents(events) {
      for (const event of Array.from(events).reverse()) {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      }
    },
  },
};
