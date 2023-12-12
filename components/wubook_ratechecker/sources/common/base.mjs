import wubook from "../../wubook_ratechecker.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    wubook,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const items = await this.getResources();
      if (!(items?.length > 0)) {
        return;
      }
      const idField = this.getIdField();
      const ids = {};
      for (const item of items) {
        ids[item[idField]] = true;
      }
      this._setPreviousIds(ids);
      items.slice(-25).forEach((item) => this.emitEvent(item));
    },
  },
  methods: {
    _getPreviousIds() {
      return this.db.get("previousIds");
    },
    _setPreviousIds(previousIds) {
      this.db.set("previousIds", previousIds);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    getResources() {
      throw new Error("getResources is not implemented");
    },
    getIdField() {
      throw new Error("getIdField is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const previousIds = this._getPreviousIds() || [];

    const items = await this.getResources();
    if (!(items?.length > 0)) {
      return;
    }

    const idField = this.getIdField();
    for (const item of items) {
      if (previousIds[item[idField]]) {
        continue;
      }
      this.emitEvent(item);
      previousIds[item[idField]] = true;
    }

    this._setPreviousIds(previousIds);
  },
};
