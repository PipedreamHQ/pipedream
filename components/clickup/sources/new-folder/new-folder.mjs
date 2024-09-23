import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clickup-new-folder",
  name: "New Folder (Instant)",
  description: "Emit new event when a new folder is created",
  version: "0.0.8",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    _getMeta({ folder_id: folderId }) {
      return {
        id: folderId,
        summary: String(folderId),
        ts: Date.now(),
      };
    },
    _getEventsList() {
      return [
        "folderCreated",
      ];
    },
  },
  async run(httpRequest) {
    console.log("Event received");
    this.checkSignature(httpRequest);
    this.$emit(httpRequest.body, this._getMeta(httpRequest.body));
  },
  sampleEmit,
};
