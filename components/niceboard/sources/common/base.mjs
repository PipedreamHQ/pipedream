import niceboard from "../../niceboard.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    niceboard,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    niceboardUrl: {
      propDefinition: [
        niceboard,
        "niceboardUrl",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async *paginate({
      fn, max,
    }) {
      const lastId = this._getLastId();
      const params = {
        page: 1,
      };
      let hasMore, count = 0;
      do {
        const response = await fn({
          niceboardUrl: this.niceboardUrl,
          params,
        });
        const results = this.getResults(response);
        const totalPages = this.getTotalPages(response);
        for (const item of results) {
          if (+item.id > lastId) {
            yield item;
            if (max && ++count >= max) {
              return;
            }
          }
        }
        hasMore = params.pages < totalPages;
        params.page++;
      } while (hasMore);
    },
    getMaxResults(results, max) {
      if (max && results.length > max) {
        return results.slice(-1 * max);
      }
      return results;
    },
    emitEvents(events) {
      events.forEach((event) => {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      });
    },
    getResults() {
      throw new Error("getResults is not implemented");
    },
    getTotalPages() {
      throw new Error("getTotalPages is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
