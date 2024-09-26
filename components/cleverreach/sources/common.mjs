import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../cleverreach.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getSavedResource() {
      return this.db.get("savedResource");
    },
    setSavedResource(value) {
      this.db.set("savedResource", value);
    },
    emitEvent(receiver, type) {
      this.$emit(receiver, {
        id: receiver.id,
        summary: `New ${type}: ${receiver.email}`,
        ts: new Date((receiver.registered ?? receiver.activated) * 1000).valueOf() || Date.now(),
      });
    },
    async getReceivers(params = {}) {
      const { groupId } = this;
      const receivers = await this.app.listReceivers({
        groupId,
        params: {
          "order_by": "registered desc",
          ...params,
        },
      });
      return receivers;
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  async run() {
    await this.getAndProcessData();
  },
};
