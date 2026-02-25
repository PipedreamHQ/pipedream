import common from "../common.mjs";

export default {
  key: "microsoft_power_bi-new-dataset-refresh-created",
  name: "New Dataset Refresh Created",
  description: "Emit new event when a new dataset refresh operation is created. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/get-refresh-history)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    checkStatus() {
      return true;
    },
    getSummary() {
      return "New Refresh Created";
    },
  },
};
