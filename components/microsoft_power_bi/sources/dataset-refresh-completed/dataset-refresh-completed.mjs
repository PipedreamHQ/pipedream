import common from "../common.mjs";

export default {
  key: "microsoft_power_bi-dataset-refresh-completed",
  name: "Dataset Refresh Completed",
  description: "Emits a new event when a dataset refresh operation has completed. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/get-refresh-history)",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    checkStatus(status) {
      return status === "Completed";
    },
    getSummary() {
      return "New Refresh Completed";
    },
  },
};
