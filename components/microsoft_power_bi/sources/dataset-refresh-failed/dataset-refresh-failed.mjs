import common from "../common.mjs";

export default {
  key: "microsoft_power_bi-dataset-refresh-failed",
  name: "Dataset Refresh Failed",
  description: "Emits an event when a dataset refresh operation has failed in Power BI. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/get-refresh-history)",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    checkStatus(status) {
      return status === "Failed";
    },
    getSummary() {
      return "New Failed Refresh";
    },
  },
};
