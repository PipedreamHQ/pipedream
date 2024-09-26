import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import referrizer from "../../referrizer.app.mjs";

export default {
  props: {
    referrizer,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async startEvent(maxResults = 0) {
      const items = this.referrizer.paginate({
        fn: this.getMethod(),
        maxResults,
      });

      for await (const reward of items) {
        this.$emit(reward, this.generateMeta(reward));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
