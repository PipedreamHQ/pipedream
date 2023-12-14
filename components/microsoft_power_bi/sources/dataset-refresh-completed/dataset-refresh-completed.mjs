import powerBi from "../../microsoft-power-bi.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "microsoft-power-bi-dataset-refresh-completed",
  name: "Dataset Refresh Completed",
  description: "Emits a new event when a dataset refresh operation has completed. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/get-refresh-history)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    powerBi,
    db: "$.service.db",
    datasetId: {
      propDefinition: [
        powerBi,
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
    isCompleted(status) {
      return status === "Completed";
    },
    generateMeta(refresh) {
      return {
        id: refresh.id,
        summary: `Dataset refresh completed: ${refresh.id}`,
        ts: Date.parse(refresh.endTime),
      };
    },
  },
  hooks: {
    async deploy() {
      // Emit the last 50 completed refresh operations
      const { value: refreshes } = await this.powerBi.getRefreshHistory({
        datasetId: this.datasetId,
        top: 50,
      });

      refreshes
        .filter((refresh) => this.isCompleted(refresh.status))
        .slice(0, 50)
        .forEach((refresh) => {
          this.$emit(refresh, this.generateMeta(refresh));
        });
    },
  },
  async run() {
    const lastEmittedTime = this.db.get("lastEmittedTime") || 0;
    const top = 10;
    const { value: refreshes } = await this.powerBi.getRefreshHistory({
      datasetId: this.datasetId,
      top,
    });

    // refreshes
    //   .filter((refresh) => this.isCompleted(refresh.status)
    // && Date.parse(refresh.endTime) > lastEmittedTime)
    //   .forEach((refresh) => {
    //     this.$emit(refresh, this.generateMeta(refresh));
    //   });

    // Update the last emitted time
    const latestRefreshTime = refreshes.reduce((max, { endTime }) => {
      const parsedTime = Date.parse(endTime);
      return parsedTime > max
        ? parsedTime
        : max;
    }, lastEmittedTime);

    this.db.set("lastEmittedTime", latestRefreshTime);
  },
};
