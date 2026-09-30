import hubspot from "../../hubspot.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import {
  API_PATH, MAX_INITIAL_EVENTS,
} from "../../common/constants.mjs";

// Upper bound on pages per run.
const MAX_PAGES = 50;

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
      // oldest-first, where the sample's max timestamp is NOT the newest
      // existing record. It
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
    _getBackfill(key = "") {
      return this.db.get(`backfill${key}`);
    },
    _setBackfill(backfill, key = "") {
      this.db.set(`backfill${key}`, backfill);
    },
    // An unfinished pass keeps the cursor and carries its newest ts until it completes.
    _advanceAfter(maxTs, pendingAfter = null) {
      const backfill = this._getBackfill();
      const newest = Math.max(backfill?.maxTs || 0, maxTs || 0);
      if (pendingAfter) {
        this._setBackfill({
          after: pendingAfter,
          maxTs: newest,
        });
        return;
      }
      if (backfill) {
        this._setBackfill(null);
      }
      if (newest > (this._getAfter() || 0)) {
        this._setAfter(newest);
      }
    },
    // Limits a search to records whose `propertyName` is after the cursor.
    addDateFilter(params, propertyName, after) {
      if (after) {
        const filters = params.data.filterGroups?.[0]?.filters || [];
        params.data.filterGroups = [
          {
            filters: [
              ...filters,
              {
                propertyName,
                operator: "GT",
                value: after,
              },
            ],
          },
        ];
      }
      return params;
    },
    getPageCursor({
      data, params,
    }) {
      return data
        ? data.after
        : params?.after;
    },
    setPageCursor(opts, after) {
      if (opts.data) {
        opts.data.after = after;
      } else {
        opts.params = {
          ...opts.params,
          after,
        };
      }
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
    async processEvents(resources, after, pendingAfter = null) {
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
      this._advanceAfter(maxTs, pendingAfter);
    },
    // Results are newest-first, so reaching an item at or before the cursor ends the pass.
    reachedCursor(ts, after) {
      // ts can be null (e.g. deletedAt), which only matters on the initial run
      return after
        ? !(ts > after)
        : !ts;
    },
    // Emits newest-first pages. Returns the newest ts seen, or null when the pass
    // stopped at the page cap and resumes next run.
    async paginatePass(opts, resourceFn, resultType = null, after = null, key = "") {
      const backfill = after && this._getBackfill(key);
      if (backfill) {
        this.setPageCursor(opts, backfill.after);
      }
      let maxTs = backfill?.maxTs || after || 0;
      let initialEmitted = 0;
      let page = 0;
      let done = false;
      while (!done && page < MAX_PAGES) {
        page++;
        const results = await resourceFn(opts);
        const items = (resultType
          ? results[resultType]
          : results) || [];
        for (const item of items) {
          const ts = await this.getTs(item);
          if (this.reachedCursor(ts, after)) {
            done = true;
            break;
          }
          if (!after || await this.isRelevant(item, after, ts)) {
            await this.emitEvent(item, ts);
          }
          if (ts > maxTs) {
            maxTs = ts;
          }
          // Initial (deploy) run: emit only a small capped sample.
          if (!after && ++initialEmitted >= MAX_INITIAL_EVENTS) {
            done = true;
            break;
          }
        }

        // First run reads one page; otherwise stop on the last, a repeated, or an empty page.
        const next = results.paging?.next?.after;
        if (done
          || !after
          || !next
          || next === this.getPageCursor(opts)
          || !items.length) {
          done = true;
        } else {
          this.setPageCursor(opts, next);
          this._setBackfill({
            after: next,
            maxTs,
          }, key);
        }
      }
      if (!done) {
        console.log(`Stopped after ${MAX_PAGES} pages; resuming next run.`);
        return null;
      }
      this._setBackfill(null, key);
      return maxTs;
    },
    async paginate(opts, resourceFn, resultType = null, after = null) {
      const maxTs = await this.paginatePass(opts, resourceFn, resultType, after);
      if (maxTs > (after || 0)) {
        this._setAfter(maxTs);
      }
    },
    // pagination for endpoints that return hasMore property of true/false
    async paginateUsingHasMore(
      opts,
      resourceFn,
      resultType = null,
      after = null,
      limitRequest = MAX_PAGES,
    ) {
      const { params } = opts;
      // Results are newest-first: an unfinished pass resumes below its oldest event.
      const backfill = after && this._getBackfill();
      if (backfill) {
        params.endTimestamp = backfill.end;
      }
      let maxTs = backfill?.maxTs || after || 0;
      let minTs = null;
      let initialEmitted = 0;
      let page = 0;
      let done = false;
      while (!done && page < limitRequest) {
        page++;
        const results = await resourceFn(opts);
        const items = (resultType
          ? results[resultType]
          : results) || [];
        for (const item of items) {
          const ts = this.getTs(item);
          if (minTs === null || ts < minTs) {
            minTs = ts;
          }
          if (!after || await this.isRelevant(item, after)) {
            this.emitEvent(item);
            if (ts > maxTs) {
              maxTs = ts;
            }
            // Initial (deploy) run: emit only a small capped sample.
            if (!after && ++initialEmitted >= MAX_INITIAL_EVENTS) {
              done = true;
              break;
            }
          }
        }

        // First run reads one page; otherwise stop on the last, a repeated, or an empty page.
        if (!after
          || !results.hasMore
          || !results.offset
          || results.offset === params.offset
          || !items.length) {
          done = true;
        } else {
          params.offset = results.offset;
          this._setBackfill({
            end: minTs,
            maxTs,
          });
        }
      }
      if (!done) {
        console.log(`Stopped after ${limitRequest} pages; resuming older events next run.`);
        return;
      }
      this._setBackfill(null);
      if (maxTs > (after || 0)) {
        this._setAfter(maxTs);
      }
    },
    // Collects newest-first pages. Pass `pendingAfter` to processEvents, which
    // saves it only after the items are emitted, so the next run resumes there.
    async getPaginatedItems(resourceFn, opts, after = null) {
      const backfill = after && this._getBackfill();
      if (backfill) {
        this.setPageCursor(opts, backfill.after);
      }
      const items = [];
      let page = 0;
      while (page < MAX_PAGES) {
        page++;
        const {
          results = [], paging,
        } = await resourceFn(opts);
        items.push(...results);
        const next = paging?.next?.after;
        if (!after
          || !next
          || next === this.getPageCursor(opts)
          || !results.length) {
          return {
            items,
            pendingAfter: null,
          };
        }
        this.setPageCursor(opts, next);
      }
      console.log(`Stopped after ${MAX_PAGES} pages; resuming next run.`);
      return {
        items,
        pendingAfter: this.getPageCursor(opts),
      };
    },
    // Adds `associations` in the shape the CRM v3 GET list endpoints return.
    async withAssociations(objectType, records, toObjectTypes) {
      if (!records.length) {
        return records;
      }
      const inputs = records.map(({ id }) => ({
        id,
      }));
      const byId = {};
      for (const toObjectType of toObjectTypes) {
        const { results = [] } = await this.hubspot.makeRequest({
          api: API_PATH.CRMV3,
          method: "POST",
          endpoint: `/associations/${objectType}/${toObjectType}/batch/read`,
          data: {
            inputs,
          },
        });
        // Standard types are keyed by plural name; custom objects (p<portal>_<name>) as-is.
        const key = toObjectType === "company"
          ? "companies"
          : /^p\d+_/.test(toObjectType)
            ? toObjectType
            : `${toObjectType}s`;
        for (const {
          from, to,
        } of results) {
          byId[from.id] = {
            ...byId[from.id],
            [key]: {
              results: to,
            },
          };
        }
      }
      return records.map((record) => (byId[record.id]
        ? {
          ...record,
          associations: byId[record.id],
        }
        : record));
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
