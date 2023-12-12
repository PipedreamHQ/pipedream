import streamtime from "../../streamtime.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    streamtime,
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
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    filterSearchResults(searchResults) {
      return searchResults;
    },
    async getPaginatedResults(resourceFn, args) {
      const lastId = this._getLastId();
      let maxId = lastId;
      args = {
        ...args,
        data: {
          ...args.data,
          offset: 0,
        },
      };
      let total = 0;
      const results = [];

      do {
        const { searchResults } = await resourceFn(args);
        for (const item of this.filterSearchResults(searchResults)) {
          if (item.id > lastId) {
            results.push(item);
            if (item.id > maxId) {
              maxId = item.id;
            }
          }
        }
        total = searchResults?.length;
        args.data.offset += args.data.maxResults;
      } while (total === args.data.maxResults);

      this._setLastId(maxId);
      return results;
    },
  },
};
