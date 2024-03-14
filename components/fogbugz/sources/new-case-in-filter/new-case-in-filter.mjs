import { CASE_COLS } from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "fogbugz-new-case-in-filter",
  name: "New Case in Filter",
  description: "Emit new new event when there's a new case under a specified filter. Note this may not effectively work for filters that generate results too long, or filters with more than 50,000 cases, especially if your FogBugz site is running Ocelot.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    criteria: {
      type: "string",
      label: "criteria",
      description: "The filter you want to apply to the search. For more details about how to combine multiple search criteria read our [Ultimate FogBugz Search Guide](https://support.fogbugz.com/hc/en-us/articles/360011257174-Searching-in-FogBugz-Syntax-and-the-Search-Axis-the-Ultimate-Guide-for-Complex-FogBugz-Searches#case-axes).",
    },
  },
  methods: {
    ...common.methods,
    getData() {
      return {
        cmd: "search",
        q: this.criteria,
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
