import nuclino from "../../nuclino.app.mjs";
import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  props: {
    nuclino,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workspaceId: {
      propDefinition: [
        nuclino,
        "workspaceId",
      ],
    },
    object: {
      propDefinition: [
        nuclino,
        "object",
      ],
      optional: true,
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
      return this.nuclino.listItems;
    },
    getParams() {
      return {
        workspaceId: this.workspaceId,
      };
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const fn = this.getResourceFn();
      const params = this.getParams();
      const tsField = this.getTsField();

      const results = this.nuclino.paginate({
        fn,
        params,
        max,
      });
      for await (const item of results) {
        const ts = Date.parse(item[tsField]);
        if (ts > lastTs && (!this.object || item.object === this.object)) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
          maxTs = Math.max(maxTs, ts);
        }
      }

      this._setLastTs(maxTs);
    },
    getTsField() {
      throw new ConfigurationError("getTsField is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(25);
    },
  },
  async run() {
    await this.processEvents();
  },
};
