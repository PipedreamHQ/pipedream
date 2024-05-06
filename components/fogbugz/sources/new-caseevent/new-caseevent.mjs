import { CASE_COLS } from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "fogbugz-new-caseevent",
  name: "New Case Event",
  description: "Emit new event instantaneously when something significant happens to a case.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getInitialValue() {
      return "1970-01-01T00:00:00Z";
    },
    getData() {
      return {
        cmd: "listCases",
        cols: CASE_COLS,
      };
    },
    getDataField() {
      return "cases";
    },
    getIdField() {
      return "dtLastUpdated";
    },
    getSummary(item) {
      return `New case event created with Id: ${item.ixBug}`;
    },
  },
  sampleEmit,
};
