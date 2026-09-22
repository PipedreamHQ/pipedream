import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../digistore24.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "How often to poll the API for new data",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getTsField() {
      throw new Error("getTsField method must be implemented");
    },
    getLastProcessedTime() {
      return this.db.get("lastProcessedTime") || null;
    },
    setLastProcessedTime(time) {
      this.db.set("lastProcessedTime", time);
    },
    getFieldKey() {
      throw new Error("getFieldId method must be implemented");
    },
    generateMeta() {
      throw new Error("generateMeta method must be implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn method must be implemented");
    },
    getResourceFnArgs() {
      return {
        data: {
          from: this.getLastProcessedTime() || constants.DEFAULT_TIME_RANGE,
          to: "now",
          page_size: constants.DEFAULT_PAGE_SIZE,
          page_no: 1,
        },
      };
    },
    processEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
  },
  hooks: {
    async deploy() {
      const resourceFn = this.getResourceFn();
      const args = this.getResourceFnArgs();
      const fieldKey = this.getFieldKey();
      const tsField = this.getTsField();

      const response = await resourceFn(args);
      const items = utils.getNestedProperty(response, fieldKey) || [];

      // makes sure order items by tsField in descending order
      const sortedItems =
        Array.from(items).sort((a, b) => Date.parse(b[tsField]) - Date.parse(a[tsField]));

      Array.from(sortedItems)
        .reverse()
        .forEach(this.processEvent);

      if (sortedItems.length > 0) {
        const latestItem = sortedItems[0];
        const lastProcessedTime = utils.getNestedProperty(latestItem, tsField);
        this.setLastProcessedTime(lastProcessedTime);
      }
    },
  },
  async run() {
    const resourceFn = this.getResourceFn();
    const args = this.getResourceFnArgs();
    const fieldKey = this.getFieldKey();
    const tsField = this.getTsField();

    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await resourceFn({
        ...args,
        data: {
          ...args.data,
          page_no: page,
        },
      });

      const items = utils.getNestedProperty(response, fieldKey) || [];

      // makes sure order items by tsField in descending order
      const sortedItems =
        Array.from(items).sort((a, b) => Date.parse(b[tsField]) - Date.parse(a[tsField]));

      if (sortedItems.length === 0) {
        hasMore = false;
        break;
      }

      // Process items in chronological order (oldest first)
      Array.from(sortedItems)
        .reverse()
        .forEach((item) => {
          this.processEvent(item);
        });

      const latestItem = sortedItems[0];
      const lastProcessedTime = utils.getNestedProperty(latestItem, tsField);
      this.setLastProcessedTime(lastProcessedTime);

      // If we got fewer items than page size, we're on the last page
      if (sortedItems.length < constants.DEFAULT_PAGE_SIZE) {
        hasMore = false;
      } else {
        page++;
      }
    }
  },
};
