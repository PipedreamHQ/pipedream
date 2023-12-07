import base from "../new-file/new-file.mjs";
import onedrive from "../../microsoft_onedrive.app.mjs";

export default {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-folder-in-folder",
  name: "New Folder in Folder (Instant)",
  description: "Emit an event when a new folder is created under a directory tree in a OneDrive drive",
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
      return !!(driveItem.folder) && driveItem.parentReference?.path !== "/drive/root:";
    },
  },
};
