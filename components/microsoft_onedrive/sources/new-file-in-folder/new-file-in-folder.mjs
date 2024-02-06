import onedrive from "../../microsoft_onedrive.app.mjs";
import sampleEmit from "./test-event.mjs";
import base from "../common/base.mjs";

export default {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-file-in-folder",
  name: "New File in Folder (Instant)",
  description: "Emit an event when a new file is added to a specific directory tree in a OneDrive drive",
  version: "0.1.0",
  dedupe: "unique",
  props: {
    ...base.props,
    folder: {
      propDefinition: [
        onedrive,
        "folder",
      ],
    },
  },
  methods: {
    ...base.methods,
    getDeltaLinkParams() {
      return {
        folderId: this.folder,
      };
    },
    isItemRelevant(driveItem) {
      return !!(driveItem.file);
    },
  },
  sampleEmit,
};
