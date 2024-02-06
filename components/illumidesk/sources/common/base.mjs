import illumidesk from "../../illumidesk.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    illumidesk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    campusSlug: {
      propDefinition: [
        illumidesk,
        "campusSlug",
      ],
    },
    courseSlug: {
      propDefinition: [
        illumidesk,
        "courseSlug",
        (c) => ({
          campusSlug: c.campusSlug,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getArgs() {
      return {};
    },
    getTsField() {
      return "updated";
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async startEvent(limit) {
      const lastTs = this._getLastTs();

      const items = this.illumidesk.paginate({
        resourceFn: this.getResourceFn(),
        args: this.getArgs(),
      });

      const results = [];
      for await (const item of items) {
        const ts = Date.parse(item[this.getTsField()]);
        if (ts > lastTs) {
          results.push(item);
          if (limit && results.length >= limit) {
            break;
          }
        }
      }

      if (!results.length) {
        return;
      }

      this._setLastTs(Date.parse(results[0][this.getTsField()]));

      results.reverse().forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
  async run() {
    await this.startEvent();
  },
};
