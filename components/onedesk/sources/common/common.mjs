import onedesk from "../../onedesk.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { v4 as uuidv4 } from "uuid";

export default {
  props: {
    onedesk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.resetApplicationId();
    },
  },
  methods: {
    getApplicationId() {
      return this.db.get("applicationId");
    },
    setApplicationId(applicationId) {
      this.db.set("applicationId", applicationId);
    },
    async resetApplicationId() {
      const applicationId = uuidv4();
      await this.getUpdates(applicationId);
      this.setApplicationId(applicationId);
    },
    getUpdates() {
      throw new Error("getUpdates is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const applicationId = this.getApplicationId();

    const results = await this.getUpdates(applicationId);

    await this.resetApplicationId();

    for (const result of results) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    }
  },
};
