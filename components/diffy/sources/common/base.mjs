import diffy from "../../diffy.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    diffy,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        diffy,
        "projectId",
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
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getArgs() {
      throw new Error("getArgs is not implemented");
    },
    getResourceType() {
      throw new Error("getResourceType is not implemented");
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();

    const items = this.diffy.paginate({
      resourceFn: this.getResourceFn(),
      args: this.getArgs(),
      resourceType: this.getResourceType(),
    });

    const results = [];
    for await (const item of items) {
      if (item[this.getTsField()] > lastTs) {
        results.push(item);
      }
    }

    if (!results.length) {
      return;
    }

    this._setLastTs(results[0][this.getTsField()]);

    results.reverse().forEach((item) => {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    });
  },
};
