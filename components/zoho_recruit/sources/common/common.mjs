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
  hooks: {
    async deploy() {
      const resources = await this.getResources({
        params: {
          per_page: 25,
        },
      });
      if (!resources?.length) {
        return;
      }
      const lastTs = Date.parse(resources[0][this.getTsKey()]);
      this._setLastTs(lastTs);
      resources.reverse().forEach((resource) => this.emitEvent(resource));
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

    const params = {
      per_page: 200,
      page: 1,
    };

    do {
      const resources = await this.getResources({
        params,
      });
      if (!resources?.length) {
        return;
      }
      for (const resource of resources) {
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
    } while (total === params.per_page && !done);

    if (maxLastTs) {
      this._setLastTs(maxLastTs);
    }
  },
};
