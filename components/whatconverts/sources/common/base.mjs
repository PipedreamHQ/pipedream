import whatconverts from "../../whatconverts.app.mjs";
import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  props: {
    whatconverts,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    accountId: {
      propDefinition: [
        whatconverts,
        "accountId",
      ],
    },
    profileId: {
      propDefinition: [
        whatconverts,
        "profileId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    leadType: {
      propDefinition: [
        whatconverts,
        "leadType",
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
    getParams() {
      return {
        account_id: this.accountId,
        profile_id: this.profileId,
        lead_type: this.leadType,
        order: "desc",
      };
    },
    getResourceKey() {
      return "leads";
    },
    isSorted() {
      return true;
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const fn = this.getResourceFn();
      const params = this.getParams();
      const resourceKey = this.getResourceKey();
      const tsField = this.getTsField();
      const isSorted = this.isSorted();

      const results = this.whatconverts.paginate({
        fn,
        params,
        resourceKey,
        max,
      });

      for await (const item of results) {
        const ts = Date.parse(item[tsField]);
        if (ts > lastTs) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
          maxTs = Math.max(maxTs, ts);
        } else if (isSorted) {
          break;
        }
      }

      this._setLastTs(maxTs);
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
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
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
