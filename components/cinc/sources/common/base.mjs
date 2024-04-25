import cinc from "../../cinc.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  props: {
    cinc,
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
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const limit = constants.DEFAULT_LIMIT;
    const params = {
      limit,
      offset: 0,
    };
    let total = 0;
    do {
      const { leads } = await this.cinc.listLeads({
        params,
      });
      for (const lead of leads) {
        const ts = Date.parse(lead.info.updated_date);
        if (ts > lastTs) {
          maxTs = Math.max(ts, maxTs);
          const meta = this.generateMeta(lead);
          this.$emit(lead, meta);
        }
      }
      total = leads?.length;
      params.offset += limit;
    } while (total === limit);

    this._setLastTs(maxTs);
  },
};
