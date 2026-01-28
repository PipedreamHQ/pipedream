import app from "../../marketo.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getParams() {
      throw new Error("getParams is not implemented");
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  hooks: {
    async deploy() {
      const resourceFn = this.getResourceFn();
      const params = this.getParams();
      const results = await resourceFn({
        params,
      });

      const items = results.result || [];
      items.slice(-25).reverse()
        .forEach(this.emitEvent);
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    const resourceFn = this.getResourceFn();
    const params = this.getParams(lastTs);

    let maxTs = lastTs;

    const results = await resourceFn({
      params,
    });

    const items = results.result || [];

    items.forEach((item) => {
      const ts = this.processEvent(item);
      if (ts > maxTs) {
        maxTs = ts;
      }
      this.emitEvent(item);
    });

    this._setLastTs(maxTs);
  },
};
