import pipeline from "../../pipeline.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    pipeline,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const {
        results, page,
      } = await this.pipeline.paginate(this.getResourceFn());
      this.emitResources(results.slice(-10));
      this._setPage(page);
    },
  },
  methods: {
    _getPage() {
      return this.db.get("page");
    },
    _setPage(page) {
      this.db.set("page", page);
    },
    emitResources(results) {
      for (const result of results) {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      }
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const startPage = this._getPage();
    const {
      results, page,
    } = await this.pipeline.paginate(this.getResourceFn(), {}, startPage);
    this.emitResources(results);
    this._setPage(page);
  },
};
