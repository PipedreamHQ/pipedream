import agileCrm from "../../agile_crm.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    agileCrm,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    maxRequests: {
      propDefinition: [
        agileCrm,
        "maxRequests",
      ],
    },
  },
  methods: {
    getLastCreated() {
      return this.db.get("lastCreated");
    },
    setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    isLater(createdDate, compareDate) {
      return !compareDate || +createdDate > +compareDate;
    },
    async *getPaginatedResources(compareDate, resourceFn, params = {}) {
      let cursor;
      let count = 0;

      do {
        if (cursor) {
          params.cursor = cursor;
        }
        const items = await resourceFn({
          params,
        });
        if (!items || items?.length === 0) {
          break;
        }
        for (const item of items) {
          if (this.isLater(item.created_time, compareDate)) {
            yield item;
          }
        }
        cursor = items[items.length - 1]?.cursor;
        count++;
      } while (cursor && count < this.maxRequests);
    },
    getParams() {
      return {};
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    let lastCreated = this.getLastCreated();

    const items = await this.getPaginatedResources(
      lastCreated,
      this.getResourceFn(),
      this.getParams(),
    );

    for await (const item of items) {
      if (this.isLater(item.created_time, lastCreated)) {
        lastCreated = item.created_time;
      }
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
    this.setLastCreated(lastCreated);
  },
};
