import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "_21risk-new-report",
  name: "New Report Created",
  description: "Emit new event when a new report is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "_KeyReportId";
    },
    getFunction() {
      return this._21risk.listReports;
    },
    getSummary(item) {
      return `New Report with Id: ${item._KeyReportId}`;
    },
  },
  sampleEmit,
};
