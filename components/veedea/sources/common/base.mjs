import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";
import veedea from "../../veedea.app.mjs";

export default {
  props: {
    veedea,
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
      return this.db.get("lastTs");
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    getTsField() {
      return null;
    },
    getArgs() {
      return {};
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const tsField = this.getTsField();
      const fn = this.getResourceFn();
      const args = this.getArgs();
      const token = await this.veedea.getToken();

      const results = this.veedea.paginate({
        fn,
        args: {
          ...args,
          token,
        },
        max,
      });

      const items = [];
      for await (const item of results) {
        const ts = tsField
          ? Date.parse(item[tsField])
          : null;
        if (!ts) {
          items.push(item);
        } else {
          if (ts > lastTs) {
            items.push(item);
          } else {
            break;
          }
        }
      }

      if (!items.length) {
        return;
      }

      this._setLastTs(Date.parse(items[0][tsField]));

      items.reverse().forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
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
