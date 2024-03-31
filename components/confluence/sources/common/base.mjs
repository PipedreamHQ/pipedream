import confluence from "../../confluence.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    confluence,
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
      return {};
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getTs() {
      throw new Error("getTsField is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    generateMeta(post) {
      const ts = this.getTs(post);
      return {
        id: `${post.id}-${ts}`,
        summary: this.getSummary(post),
        ts,
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const resourceFn = this.getResourceFn();
      const args = await this.getArgs();
      const items = this.confluence.paginate({
        resourceFn,
        args,
        max,
      });
      const results = [];
      for await (const item of items) {
        if (this.getTs(item) >= lastTs) {
          results.push(item);
        } else {
          break;
        }
      }
      if (!results.length) {
        return;
      }
      this._setLastTs(this.getTs(results[0]));
      results.forEach((result) => this.emitEvent(result));
    },
  },
  async run() {
    await this.processEvent();
  },
};
