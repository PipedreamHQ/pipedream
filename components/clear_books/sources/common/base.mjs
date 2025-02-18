import clearBooks from "../../clear_books.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    clearBooks,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    getBaseArgs() {
      return {
        params: {
          sortBy: "id",
          sortDirection: "descending",
        },
      };
    },
    getArgs() {
      return {};
    },
    getFn() {
      throw new Error("getFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvent(max) {
      const lastId = this._getLastId();
      const results = [];

      const items = this.clearBooks.paginate({
        fn: this.getFn(),
        args: {
          ...this.getBaseArgs(),
          ...this.getArgs(),
        },
        max,
      });

      for await (const item of items) {
        if (item.id > lastId) {
          results.push(item);
        } else {
          break;
        }
      }

      if (!results.length) {
        return;
      }

      this._setLastId(results[0].id);
      results.reverse().forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
