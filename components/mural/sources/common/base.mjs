import mural from "../../mural.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    mural,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workspaceId: {
      propDefinition: [
        mural,
        "workspaceId",
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
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getArgs() {
      return {};
    },
    getTsField() {
      return "createdOn";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: item[this.getTsField()],
      };
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const fn = this.getResourceFn();
      const args = this.getArgs();
      const tsField = this.getTsField();

      const results = this.mural.paginate({
        fn,
        args,
        max,
      });

      const items = [];
      for await (const item of results) {
        const ts = item[tsField];
        if (ts > lastTs) {
          items.push(item);
          maxTs = Math.max(ts, maxTs);
        }
      }

      this._setLastTs(maxTs);

      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
  async run() {
    await this.processEvent();
  },
};
