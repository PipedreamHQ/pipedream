import onedrive from "../../microsoft_onedrive.app.mjs";
import base from "../common/base.mjs";

export default {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-file-of-types-in-folder",
  name: "New File of Types in Folder (Instant)",
  description: "Emit an event when a new file of a specific type is created under a directory tree in a OneDrive drive",
  version: "0.1.0",
  dedupe: "unique",
  props: {
    ...base.props,
    folder: {
      propDefinition: [
        onedrive,
        "folder",
      ],
      description: "The OneDrive folder to watch for new files (leave empty to watch the entire drive). Use the \"Load More\" button to load subfolders.",
      optional: true,
    },
    fileTypes: {
      propDefinition: [
        onedrive,
        "fileTypes",
      ],
    },
  },
  methods: {
    ...base.methods,
    isItemTypeRelevant(driveItem) {
      const fileType = driveItem?.file?.mimeType;
      return (
        base.methods.isItemTypeRelevant.call(this, driveItem) &&
        this.fileTypes.includes(fileType)
      );
    },
  },
};
