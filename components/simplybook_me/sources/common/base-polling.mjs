import simplybook_me from "../../simplybook_me.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    simplybook_me,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    filterRelevantItems(items) {
      return items;
    },
    getParams() {
      return {};
    },
    async processEvents(max) {
      const resourceFn = this.getResourceFn();
      const params = this.getParams();
      const results = this.simplybook_me.paginate({
        resourceFn,
        params,
      });
      let items = [];
      for await (const item of results) {
        items.push(item);
      }
      if (!items.length) {
        return;
      }
      items = this.filterRelevantItems(items);
      if (max && items.length > max) {
        items = items.slice(-1 * max);
      }
      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};
