import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_appsheet-add-row",
  name: "Add Row",
  description: "Adds a new row to a specific table in the AppSheet app. [See the documentation](https://support.google.com/appsheet/answer/10104797?hl=en&ref_topic=10105767&sjid=1665780.0.1444403316-SA#)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getAction() {
      return "Add";
    },
    getSummary() {
      return "Added a new row successfully";
    },
  },
};
