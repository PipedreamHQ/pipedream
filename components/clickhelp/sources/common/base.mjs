import clickhelp from "../../clickhelp.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    clickhelp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        clickhelp,
        "projectId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getArgs() {
      return {
        projectId: this.projectId,
      };
    },
    isRelevant() {
      return true;
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      const items = await resourceFn(args);
      if (!items.length) {
        return;
      }
      let results = [];
      for (const item of items) {
        const ts = Date.parse(item[this.getTsField()]);
        if (ts >= lastTs) {
          maxTs = Math.max(ts, maxTs);
          if (this.isRelevant(item)) {
            results.push(item);
          }
        }
      }
      if (max) {
        results = results.slice(max * -1);
      }
      results.forEach((item) => this.emitEvent(item));
      this._setLastTs(maxTs);
    },
  },
  async run() {
    await this.processEvent();
  },
};
