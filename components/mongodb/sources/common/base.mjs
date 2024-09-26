import mongodb from "../../mongodb.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    mongodb,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "Pipedream will poll the API on this schedule",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    processEvent() {
      throw new Error("processEvent not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta not implemented");
    },
    emitEvent(item, ts) {
      const meta = this.generateMeta(item, ts);
      this.$emit(item, meta);
    },
  },
  async run(event) {
    const { timestamp } = event;
    const client = await this.mongodb.getClient();
    await this.processEvent(client, timestamp);
    await client.close();
  },
};
