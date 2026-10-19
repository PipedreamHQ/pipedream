import confluenceDataCenter from "../../confluence_data_center.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const PAGE_SIZE = 50;
const DEPLOY_EVENT_LIMIT = 25;

export default {
  props: {
    confluenceDataCenter,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    spaceKey: {
      propDefinition: [
        confluenceDataCenter,
        "spaceKey",
      ],
      description: "Only emit events for content in this space. Leave blank to watch all spaces.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(DEPLOY_EVENT_LIMIT);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getContentType() {
      throw new Error("getContentType is not implemented");
    },
    getOrderField() {
      throw new Error("getOrderField is not implemented");
    },
    getTs() {
      throw new Error("getTs is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    isRelevant() {
      return true;
    },
    getCql() {
      const clauses = [
        `type = "${this.getContentType()}"`,
      ];
      if (this.spaceKey) {
        clauses.push(`space = "${this.spaceKey.replace(/"/g, "\\\"")}"`);
      }
      return `${clauses.join(" AND ")} ORDER BY ${this.getOrderField()} DESC`;
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      // Without a stored cursor there is nothing to compare against, so never page through
      // the whole instance: fall back to the same bounded window deploy() uses.
      if (!lastTs && !max) {
        max = DEPLOY_EVENT_LIMIT;
      }
      const cql = this.getCql();
      const items = [];
      let newestTs;
      let start = 0;
      let done = false;

      while (!done) {
        const { results = [] } = await this.confluenceDataCenter.searchContent({
          params: {
            cql,
            expand: "history,version,space",
            limit: PAGE_SIZE,
            start,
          },
        });

        for (const item of results) {
          const ts = this.getTs(item);
          // Results are newest-first, so the first one is the high-water mark even if
          // it is filtered out below (prevents a later run from backfilling everything).
          if (newestTs === undefined) {
            newestTs = ts;
          }
          // Strictly older than the cursor: everything after this has been seen.
          // Items equal to the cursor are re-read (timestamps are second-precision)
          // and de-duplicated by `dedupe: "unique"` on meta.id.
          if (ts < lastTs) {
            done = true;
            break;
          }
          if (!this.isRelevant(item)) {
            continue;
          }
          items.push(item);
          if (max && items.length >= max) {
            done = true;
            break;
          }
        }

        if (results.length < PAGE_SIZE) {
          done = true;
        }
        start += PAGE_SIZE;
      }

      if (newestTs !== undefined && newestTs > lastTs) {
        this._setLastTs(newestTs);
      }

      // Emit oldest first.
      items.reverse().forEach((item) => {
        this.$emit(item, this.generateMeta(item));
      });
    },
  },
  async run() {
    await this.processEvents();
  },
};
