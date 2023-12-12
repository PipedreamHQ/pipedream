import zohoRecruit from "../../zoho_recruit.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    zohoRecruit,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    module: {
      propDefinition: [
        zohoRecruit,
        "module",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    async getResources({ params }) {
      const { data } = await this.zohoRecruit.listRecords({
        moduleName: this.module,
        params: {
          ...params,
          sort_order: "desc",
          sort_by: this.getTsKey(),
        },
      });
      return data;
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getTsKey() {
      throw new Error("getTsKey is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxLastTs;
    let total = 0;
    const tsKey = this.getTsKey();
    let done = false;
    const firstTimeThrough = lastTs === 0;

    const params = {
      per_page: firstTimeThrough
        ? 25
        : 200,
      page: 1,
    };

    do {
      const resources = await this.getResources({
        params,
      });
      if (!resources?.length) {
        return;
      }
      for (const resource of Array.from(resources).reverse()) {
        if (Date.parse(resource[tsKey]) > lastTs) {
          this.emitEvent(resource);
        } else {
          done = true;
        }
        if (!maxLastTs) {
          maxLastTs = Date.parse(resource[tsKey]);
        }
      }
      total = resources.length;
      params.page += 1;
    } while (total === params.per_page && !done && !firstTimeThrough);

    if (maxLastTs) {
      this._setLastTs(maxLastTs);
    }
  },
};
