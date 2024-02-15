import { axios } from "@pipedream/platform";
import reform from "../../reform.app.mjs";

export default {
  key: "reform-new-response-instant",
  name: "New Response Instant",
  description: "Emit new event when a new response is submitted in Reform",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    reform: {
      type: "app",
      app: "reform",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at,
      } = data;
      return {
        id,
        summary: `New Response: ${id}`,
        ts: Date.parse(created_at),
      };
    },
  },
  async run() {
    let lastRunTime = this.db.get("lastRunTime") || this.reform._baseUrl();
    const params = {
      created_at: lastRunTime,
    };
    const results = await this.reform.emitNewResponseEvent(params);
    for (const result of results) {
      this.$emit(result, this.generateMeta(result));
    }
    lastRunTime = new Date().toISOString();
    this.db.set("lastRunTime", lastRunTime);
  },
};
