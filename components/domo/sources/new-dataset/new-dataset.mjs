import { axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import domoApp from "../../domo.app.mjs";

export default {
  key: "domo-new-dataset",
  name: "New Dataset Added",
  description: "Emit new event when a new dataset is added to the Domo instance. [See the documentation](),
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    domo: {
      type: "app",
      app: "domo",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    datasetOwner: {
      propDefinition: [domoApp, "datasetOwner"],
      optional: true,
    },
    datasetTags: {
      propDefinition: [domoApp, "datasetTags"],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      try {
        const allDatasets = await this.domo.listDatasets({
          owner: this.datasetOwner,
          tags: this.datasetTags,
          limit: 50,
          sort: "created",
          order: "desc",
        });

        for (const dataset of allDatasets.reverse()) {
          this.$emit(
            dataset,
            {
              id: dataset.id,
              summary: `New Dataset: ${dataset.name}`,
              ts: new Date(dataset.created).getTime(),
            }
          );
        }

        const datasetIds = allDatasets.map((dataset) => dataset.id);
        await this.db.set("dataset_ids", datasetIds);
      } catch (error) {
        this.$emit({ error: "Failed to fetch datasets during deploy." });
      }
    },
    async activate() {
      // No webhook to activate for polling source
    },
    async deactivate() {
      // No webhook to deactivate for polling source
    },
  },
  async run() {
    try {
      const allDatasets = await this.domo.listDatasets({
        owner: this.datasetOwner,
        tags: this.datasetTags,
        limit: 100,
        sort: "created",
        order: "desc",
      });

      const previousDatasetIds = await this.db.get("dataset_ids") || [];

      const newDatasets = allDatasets.filter(
        (dataset) => !previousDatasetIds.includes(dataset.id)
      );

      for (const dataset of newDatasets.reverse()) {
        this.$emit(
          dataset,
          {
            id: dataset.id,
            summary: `New Dataset: ${dataset.name}`,
            ts: new Date(dataset.created).getTime(),
          }
        );
      }

      const currentDatasetIds = allDatasets.slice(0, 100).map((dataset) => dataset.id);
      await this.db.set("dataset_ids", currentDatasetIds);
    } catch (error) {
      this.$emit({ error: "Failed to fetch datasets during run." });
    }
  },
};