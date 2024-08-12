import aidbase from "../../aidbase.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    aidbase,
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
      await this.processEvent();
    },
  },
  methods: {
    _getPreviousIds() {
      return this.db.get("previousIds") || {};
    },
    _setPreviousIds(previousIds) {
      this.db.set("previousIds", previousIds);
    },
    getArgs() {
      return {};
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Knowledge Item: ${item.id}`,
        ts: Date.now(),
      };
    },
    async processEvent(max) {
      const previousIds = this._getPreviousIds();
      const resourceFn = this.getResourceFn();
      let args = this.getArgs();
      args = {
        ...args,
        params: {
          ...args.params,
        },
      };
      let more, count = 0;

      do {
        const {
          data: {
            items, next_cursor: next, has_more: hasMore,
          },
        } = await resourceFn(args);
        for (const item of items) {
          if (!previousIds[item.id]) {
            previousIds[item.id] = true;
            if (!max || count < max) {
              const meta = this.generateMeta(item);
              this.$emit(item, meta);
              count++;
            }
          }
        }
        args.params.cursor = next;
        more = hasMore;
      } while (more);

      this._setPreviousIds(previousIds);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
