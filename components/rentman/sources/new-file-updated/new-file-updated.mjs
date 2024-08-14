import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "rentman-new-file-updated",
  name: "New File Uploaded/Updated",
  description: "Emit new event when a file is uploaded/updated. [See the documentation](https://api.rentman.net/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "modified";
    },
    getFunction() {
      return this.rentman.listItems.bind(null, "files");
    },
    getParams({ lastDate }) {
      return {
        "modified[gt]": lastDate,
        "sort": "-modified",
      };
    },
    getSummary(item) {
      return `New file updated: ${item.displayname}`;
    },
  },
  sampleEmit,
};
