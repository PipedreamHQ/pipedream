import powerBiApp from "../../microsoft-power-bi.app.mjs";

export default {
  key: "microsoft-power-bi-dataset-refresh-failed",
  name: "Dataset Refresh Failed",
  description: "Emits an event when a dataset refresh operation has failed in Power BI. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/get-refresh-history)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    powerBiApp,
    db: "$.service.db",
    datasetId: {
      propDefinition: [
        powerBiApp,
        "datasetId",
      ],
    },
    top: {
      propDefinition: [
        powerBiApp,
        "top",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 3600, // 1 hour
      },
    },
  },
  methods: {
    _getFailedRefreshes(refreshes) {
      return refreshes.filter((refresh) => refresh.status === "Failed");
    },
    _getLastRefreshTime() {
      return this.db.get("lastRefreshTime") ?? null;
    },
    _setLastRefreshTime(time) {
      this.db.set("lastRefreshTime", time);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the last 50 refreshes to check for any failed ones
      const refreshes = await this.powerBiApp.getRefreshHistory({
        datasetId: this.datasetId,
        top: 50,
      });

      // Filter out the failed refreshes
      const failedRefreshes = this._getFailedRefreshes(refreshes.value);

      // Emit events for each failed refresh
      failedRefreshes.forEach((refresh) => {
        this.$emit(refresh, {
          summary: `Failed Dataset Refresh: ${refresh.id}`,
          id: refresh.id,
          ts: Date.parse(refresh.endTime),
        });
      });

      // Set the last refresh time to the latest refresh time
      if (failedRefreshes.length > 0) {
        const lastRefreshTime = failedRefreshes[0].endTime;
        this._setLastRefreshTime(Date.parse(lastRefreshTime));
      }
    },
  },
  async run() {
    // Fetch the last refreshes since the last stored refresh time
    const lastRefreshTime = this._getLastRefreshTime();
    const refreshes = await this.powerBiApp.getRefreshHistory({
      datasetId: this.datasetId,
      top: this.top,
    });

    // Filter out the failed refreshes since the last refresh time
    const newFailedRefreshes = this._getFailedRefreshes(refreshes.value)
      .filter((refresh) => !lastRefreshTime || Date.parse(refresh.endTime) > lastRefreshTime);

    // Emit events for each new failed refresh
    newFailedRefreshes.forEach((refresh) => {
      this.$emit(refresh, {
        summary: `Failed Dataset Refresh: ${refresh.id}`,
        id: refresh.id,
        ts: Date.parse(refresh.endTime),
      });
    });

    // Update the last refresh time if new failed refreshes were found
    if (newFailedRefreshes.length > 0) {
      const latestRefreshTime = newFailedRefreshes[0].endTime;
      this._setLastRefreshTime(Date.parse(latestRefreshTime));
    }
  },
};
