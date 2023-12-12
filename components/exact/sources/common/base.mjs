import exact from "../../exact.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    exact,
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
      const {
        d: {
          results: [
            { CurrentDivision: currentDivision } = {},
          ] = [],
        },
      } = await this.exact.getDivision({
        params: {
          ["$select"]: "CurrentDivision",
        },
      });
      this._setDivision(currentDivision);

      const { d: { results } } = await this.getResults(currentDivision);
      this.processResults(results.slice(-25));
    },
  },
  methods: {
    _getDivision() {
      return this.db.get("division");
    },
    _setDivision(division) {
      this.db.set("division", division);
    },
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    processResults(results, lastCreated = 0) {
      let maxTs = lastCreated;
      for (const result of results) {
        const created = this.getCreatedTs(result);
        if (created > lastCreated) {
          const meta = this.generateMeta(result);
          this.$emit(result, meta);
        }
        if (created > maxTs) {
          maxTs = created;
        }
      }
      this._setLastCreated(maxTs);
    },
    async paginateResults(division, args = {}) {
      const allResults = [];
      while (true) {
        const {
          d: {
            results, __next: next,
          },
        } = await this.getResults(division, {
          args,
        });
        allResults.push(...results);
        if (!next) {
          break;
        }
        args.url = next;
      }
      return allResults;
    },
    getResults() {
      throw new Error("getResults() is not implemented");
    },
    getCreatedTs() {
      throw new Error("getCreatedTs() is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta() is not implemented");
    },
  },
  async run() {
    const division = this._getDivision();
    const lastCreated = this._getLastCreated();
    const results = await this.paginateResults(division);
    this.processResults(results, lastCreated);
  },
};
