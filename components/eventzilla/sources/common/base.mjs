import eventzilla from "../../eventzilla.app.mjs";
import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  props: {
    eventzilla,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getArgs() {
      return {};
    },
    getResourceKey() {
      return;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.now(),
      };
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getSummary() {
      throw new ConfigurationError("getSummary is not implemented");
    },
  },
  async run() {
    const fn = this.getResourceFn();
    const args = this.getArgs();
    const resourceKey = this.getResourceKey();

    try {
      let items = await this.eventzilla.getPaginatedResources({
        fn,
        args,
        resourceKey,
      });

      if (!items?.length) {
        return;
      }

      for (const item of items) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    } catch (error) {
      if (error.message) {
        console.log(JSON.parse(error.message).message);
      } else {
        throw new ConfigurationError(error);
      }
    }
  },
};
