import onedrive from "../../microsoft_onedrive.app.mjs";
import base from "../common/base.mjs";

export default {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-file-in-folder",
  name: "New File in Folder (Instant)",
  description: "Emit an event when a new file is added to a specific directory tree in a OneDrive drive",
  version: "0.0.2",
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
};
