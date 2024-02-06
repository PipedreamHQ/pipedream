import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";
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
      optional: true,
    },
    customDatasetId: {
      type: "string",
      label: "Custom Dataset ID",
      description: "You may enter a Dataset ID directly. Either Dataset ID or Custom Dataset ID must be entered.",
      optional: true,
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
        datasetId: this.datasetId || this.customDatasetId,
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
      if (!this.datasetId && !this.customDatasetId) {
        throw new ConfigurationError("Must enter one of Dataset ID or custom Dataset ID");
      }
      if (this.datasetId && this.customDatasetId) {
        throw new ConfigurationError("Please enter only one of Dataset ID or Custom Dataset ID");
      }
      await this.getAndProcessItems();
    },
  },
  async run() {
    await this.getAndProcessItems();
  },
};
