import facebookGroups from "../../facebook_groups.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    facebookGroups,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    group: {
      propDefinition: [
        facebookGroups,
        "group",
      ],
    },
  },
  methods: {
    _getLastCreatedTs() {
      return this.db.get("lastCreatedTs") || 0;
    },
    _setLastCreatedTs(lastCreatedTs) {
      this.db.set("lastCreatedTs", lastCreatedTs);
    },
    async getNewResources({
      fn, args,
    }) {
      const lastCreatedTs = this._getLastCreatedTs();

      const { data } = await fn(args);

      const items = [];
      let maxTs = lastCreatedTs;
      for await (const item of data) {
        const ts = this.getTs(item);
        if (ts > lastCreatedTs) {
          items.push(item);
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
      }

      this._setLastCreatedTs(maxTs);
      return items;
    },
    getArgs() {
      throw new Error("getArgs is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getTs() {
      throw new Error("getTs is not implemented");
    },
  },
  async run() {
    const items = await this.getNewResources(this.getArgs());
    for (const item of items) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
};
