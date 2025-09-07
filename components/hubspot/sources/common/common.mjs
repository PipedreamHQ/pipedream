import hubspot from "../../hubspot.app.mjs";
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
    _getAfter() {
      return this.db.get("after");
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
    async getWriteOnlyProperties(resourceName) {
      const { results: properties } = await this.hubspot.getProperties({
        objectType: resourceName,
      });
      return properties.filter(({ modificationMetadata }) => !modificationMetadata.readOnlyValue);
    },
    getChunks(items) {
      const MAX_CHUNK_SIZE = 45;
      return Array.from({
        length: Math.ceil(items.length / MAX_CHUNK_SIZE),
      })
        .map((_, index) => index * MAX_CHUNK_SIZE)
        .map((begin) => items.slice(begin, begin + MAX_CHUNK_SIZE));
    },
    processChunk({
      batchRequestFn,
      mapper = ({ id }) => ({
        id,
      }),
    }) {
      return async (chunk) => {
        const { results } = await batchRequestFn(chunk.map(mapper));
        return results;
      };
    },
    async processChunks({
      chunks, ...args
    }) {
      const promises = chunks.map(this.processChunk(args));
      const results = await Promise.all(promises);
      return results.flat();
    },
    async processEvents(resources, after) {
      let maxTs = after;
      for (const result of resources) {
        if (await this.isRelevant(result, after)) {
          this.emitEvent(result);
          const ts = this.getTs(result);
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
      }
      this._setAfter(maxTs);
    },
    async paginate(params, resourceFn, resultType = null, after = null) {
      let results = null;
      let maxTs = after || 0;
      while (!results || params.after) {
        results = await resourceFn(params);
        if (results.paging) {
          params.after = results.paging.next.after;
        } else {
          delete params.after;
        }
        if (resultType) {
          results = results[resultType];
        }

        for (const result of results) {
          const ts = this.getTs(result);
          if (!after || ts > after) {
            if (await this.isRelevant(result, after, ts)) {
              this.emitEvent(result);
            }
            if (ts > maxTs) {
              maxTs = ts;
              this._setAfter(ts);
            }
          } else {
            return;
          }
        }

        // first run, get only first page
        if (!after) {
          return;
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
      while (hasMore && (!limitRequest || count < limitRequest)) {
        count++;
        results = await resourceFn(params);
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
          if (await this.isRelevant(item, after)) {
            this.emitEvent(item);
            const ts = this.getTs(item);
            if (ts > maxTs) {
              maxTs = ts;
              this._setAfter(ts);
            }
          }
        }

        // first run, get only first page
        if (!after) {
          return;
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
    const params = await this.getParams(after);
    await this.processResults(after, params);
  },
};
