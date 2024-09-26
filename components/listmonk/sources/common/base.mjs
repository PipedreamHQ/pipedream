import listmonk from "../../listmonk.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    listmonk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
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
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async *paginate({
      resourceFn,
      args = {},
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          page: 1,
          per_page: 100,
        },
      };
      let total = 0;
      do {
        const { data: { results } } = await resourceFn(args);
        for (const item of results) {
          yield item;
        }
        args.params.page++;
        total = results?.length;
      } while (total === args.params.per_page);
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const items = this.paginate({
      resourceFn: this.getResourceFn(),
    });

    for await (const item of items) {
      const ts = Date.parse(item.created_at);
      if (ts > lastTs) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
        if (ts > maxTs) {
          maxTs = ts;
        }
      }
    }

    this._setLastTs(maxTs);
  },
};
