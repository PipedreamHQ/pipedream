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
      const response = this.facebookGroups.paginate({
        fn,
        args,
      });

      const items = [];
      let maxTs = lastCreatedTs;
      for await (const item of response) {
        if (item.created_time > lastCreatedTs) {
          items.push(item);
          if (item.created_time > maxTs) {
            maxTs = item.created_time;
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
  },
  async run() {
    const items = await this.getNewResources(this.getArgs());
    for (const item of items) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
};
