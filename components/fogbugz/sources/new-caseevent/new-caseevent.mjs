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
      return "ixBug";
    },
    getSummary(item) {
      return `New case event created with Id: ${item.ixBug}`;
    },
  },
  sampleEmit,
};
