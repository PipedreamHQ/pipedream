import common from "../common/base.mjs";
import { getTimestamp } from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "renderio-new-stored-file",
  name: "New Stored File",
  description: "Emit new event when a new file is uploaded to the account. [See the documentation](https://renderio.dev/docs/api-reference/files/list-files)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(file) {
      return {
        id: file.file_id,
        summary: `New stored file: ${file.file_id}`,
        ts: getTimestamp(file),
      };
    },
    getFn() {
      return this.renderio.listFiles;
    },
    getListKey() {
      return "files";
    },
  },
  sampleEmit,
};
