import hubspot from "../../hubspot.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { MAX_INITIAL_EVENTS } from "../../common/constants.mjs";

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
  hooks: {
    async deploy() {
      // Emit a small, capped sample of pre-existing ("retroactive") events on
      // deploy, so that run() only ever emits genuinely new events. Emitting
      // here (rather than on the first run()) is what lets the platform honor
      // the user's deploy-time opt-out, where $emit is a no-op only during
      // deploy().
      const deployTs = Date.now();
      const params = await this.getParams(null);
      await this.processResults(null, params);
      // Pin the cursor to deploy time, regardless of what the sample pass stored.
      // Every pre-existing event has a timestamp <= deployTs, so this can never
      // suppress a genuinely new event, and it guarantees run() never emits a
      // pre-deploy event even when the underlying endpoint returns results
      // oldest-first (e.g. the CRM v3 GET list endpoints used by notes/tasks),
      // where the sample's max timestamp is NOT the newest existing record. It
      // also covers the "no events to sample" case, where processResults would
      // otherwise leave the cursor unset (or at 0).
      this._setAfter(deployTs);
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
      let maxTs = after || 0;
      let initialEmitted = 0;
      for (const result of resources) {
        if (!after || await this.isRelevant(result, after)) {
          this.emitEvent(result);
          const ts = this.getTs(result);
          if (ts > maxTs) {
            maxTs = ts;
          }
          // Initial (deploy) run: emit only a small capped sample.
          if (!after && ++initialEmitted >= MAX_INITIAL_EVENTS) {
            break;
          }
        }
      }
      this._setAfter(maxTs);
    },
    async paginate(params, resourceFn, resultType = null, after = null) {
      let results = null;
      let maxTs = after || 0;
      let initialEmitted = 0;
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
          // Adding ts && !after to handle the case where ts is null
          // (e.g. when using deletedAt as the ts field for deleted items)
          if ((ts && !after) || ts > after) {
            if (!after || await this.isRelevant(result, after, ts)) {
              this.emitEvent(result);
            }
            if (ts > maxTs) {
              maxTs = ts;
              this._setAfter(ts);
            }
            // Initial (deploy) run: emit only a small capped sample.
            if (!after && ++initialEmitted >= MAX_INITIAL_EVENTS) {
              return;
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
      let initialEmitted = 0;
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
          if (!after || await this.isRelevant(item, after)) {
            this.emitEvent(item);
            const ts = this.getTs(item);
            if (ts > maxTs) {
              maxTs = ts;
              this._setAfter(ts);
            }
            // Initial (deploy) run: emit only a small capped sample.
            if (!after && ++initialEmitted >= MAX_INITIAL_EVENTS) {
              return;
            }
          }
        }

        // first run, get only first page
        if (!after) {
          return;
        }
      }
    },
    async getPaginatedItems(resourceFn, params, after = null) {
      const items = [];
      const maxPages = 10;
      let page = 0;
      do {
        const {
          results, paging,
        } = await resourceFn(params);
        items.push(...results);
        if (paging) {
          params.after = paging.next.after;
          page++;
        } else {
          delete params.after;
        }
      } while (params.after && after && page < maxPages);
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
    // Safety net for instances that somehow reach run() without a cursor (e.g. a
    // deploy() that never completed): never emit retroactively from run(); just
    // establish the cursor so the next run() is new-events-only. deploy()
    // normally sets this already.
    if (after == null) {
      this._setAfter(Date.now());
      return;
    }
    const params = await this.getParams(after);
    await this.processResults(after, params);
  },
};
