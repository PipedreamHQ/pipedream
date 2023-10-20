import sitecreator from "../../sitecreator_io.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    sitecreator,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    siteId: {
      propDefinition: [
        sitecreator,
        "siteId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const ids = {};
      const items = await this.getResources();
      for (const item of items) {
        ids[item.id] = true;
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
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    getResources() {
      throw new Error("getResources is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const previousIds = this._getPreviousIds() || {};
    const items = await this.getResources();
    for (const item of items) {
      if (previousIds[item.id]) {
        continue;
      }
      previousIds[item.id] = true;
      this.emitEvent(item);
    }
    this._setPreviousIds(previousIds);
  },
};
