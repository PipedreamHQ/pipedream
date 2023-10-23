import hubspot from "../../hubspot.app.mjs";
import Bottleneck from "bottleneck";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    hubspot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _limiter() {
      return new Bottleneck({
        minTime: 250, // max 4 requests per second
      });
    },
    async _requestWithLimiter(limiter, resourceFn, params) {
      return limiter.schedule(async () => await resourceFn(params));
    },
    _getAfter() {
      return this.db.get("after") || new Date().setDate(new Date().getDate() - 1); // 1 day ago
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
    async paginate(params, resourceFn, resultType = null, after = null) {
      let results = null;
      let maxTs = after || 0;
      const limiter = this._limiter();
      while (!results || params.after) {
        results = await this._requestWithLimiter(limiter, resourceFn, params);
        if (results.paging) {
          params.after = results.paging.next.after;
        } else {
          delete params.after;
        }
        if (resultType) {
          results = results[resultType];
        }

        for (const result of results) {
          if (await this.isRelevant(result, after)) {
            this.emitEvent(result);
            const ts = this.getTs(result);
            if (ts > maxTs) {
              maxTs = ts;
              this._setAfter(ts);
            }
          } else {
            return;
          }
        }
      }
    },
    // pagination for endpoints that return hasMore property of true/false
    async paginateUsingHasMore(
      params,
      resourceFn,
      resultType = null,
      after = null,
      limitRequest = null,
    ) {
      let hasMore = true;
      let results, items;
      let count = 0;
      let maxTs = after || 0;
      const limiter = this._limiter();
      while (hasMore && (!limitRequest || count < limitRequest)) {
        count++;
        results = await this._requestWithLimiter(limiter, resourceFn, params);
        hasMore = results.hasMore;
        if (hasMore) {
          params.offset = results.offset;
        }
        if (resultType) {
          items = results[resultType];
        } else {
          items = results;
        }
        for (const item of items) {
          if (this.isRelevant(item, after)) {
            this.emitEvent(item);
            const ts = this.getTs(item);
            if (ts > maxTs) {
              maxTs = ts;
              this._setAfter(ts);
            }
          }
        }
      }
    },
    async getPaginatedItems(resourceFn, params) {
      const items = [];
      do {
        const {
          results, paging,
        } = await resourceFn(params);
        items.push(...results);
        if (paging) {
          params.after = paging.next.after;
        } else {
          delete params.after;
        }
      } while (params.after);
      return items;
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
    isRelevant() {
      return true;
    },
    getParams() {
      throw new Error("getParams not implemented");
    },
    processResults() {
      throw new Error("processResults not implemented");
    },
    getTs() {
      throw new Error("getTs not implemented");
    },
    async searchCRM(params, after) {
      await this.paginate(
        params,
        this.hubspot.searchCRM.bind(this),
        "results",
        after,
      );
    },
  },
  async run() {
    const after = this._getAfter();
    const params = this.getParams(after);
    await this.processResults(after, params);
  },
};
