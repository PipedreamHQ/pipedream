import base from "./base.mjs";
import utils from "../../common/utils.mjs";

const EVENT_COUNT = 25; // Historical event count

export default {
  ...base,
  methods: {
    ...base.methods,
    setCount(count) {
      this.db.set("count", count);
    },
    getCount() {
      return this.db.get("count") || 0;
    },
    getItem(item) {
      return item;
    },
  },
  hooks: {
    async deploy() {
      const config = this.getResourceFnConfig();
      const firstResponse = await config.resourceFn(config.resourceFnArgs);
      const recordCount = firstResponse?.METADATA?.RESULTS?.TOTAL_COUNT;
      // eslint-disable-next-line multiline-ternary
      this.setCount(recordCount > EVENT_COUNT ? recordCount - EVENT_COUNT : 0);
    },
  },
  async run() {
    let offset = this.getCount();
    const resourcesStream = utils.getResourcesStream({
      ...this.getResourceFnConfig(),
      offset,
    });
    for await (const resource of resourcesStream) {
      const item = await this.getItem(resource);
      this.$emit(item, this.getMeta(item));
      offset++;
    }
    this.setCount(offset);
  },
};
