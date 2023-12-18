import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import powerBiApp from "../microsoft_power_bi.app.mjs";

export default {
  props: {
    powerBiApp,
    db: "$.service.db",
    datasetId: {
      propDefinition: [
        powerBiApp,
        "datasetId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    checkStatus() {
      throw new Error("Status filter not implemented");
    },
    _setSavedItems(value) {
      this.db.set("items", value);
    },
    _getSavedItems() {
      return this.db.get("items") ?? [];
    },
    async getAndProcessItems() {
      const savedItems = this._getSavedItems();
      const items = await this.powerBiApp.getRefreshHistory({
        datasetId: this.datasetId,
      });

      items?.filter?.(({
        requestId, status,
      }) => !savedItems.includes(requestId) && this.checkStatus(status)).forEach((item) => {
        const ts = Date.now();
        const id = item.requestId;
        this.$emit(item, {
          id,
          summary: `${this.getSummary()}: ${id}`,
          ts,
        });
        savedItems.push(id);
      });

      this._setSavedItems(savedItems);
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessItems();
    },
  },
  async run() {
    await this.getAndProcessItems();
  },
};
