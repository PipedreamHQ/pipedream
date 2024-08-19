import onedrive from "../../microsoft_onedrive.app.mjs";
import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-file-created",
  name: "New File Created (Instant)",
  description: "Emit new event when a new file is created in a OneDrive drive",
  version: "0.0.1",
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
    getDeltaLinkParams() {
      return this.folder
        ? {
          folderId: this.folder,
        }
        : {};
    },
    isItemTypeRelevant(driveItem) {
      const fileType = driveItem?.file?.mimeType;
      return this.fileTypes?.length
        ? !!(this.fileTypes.find((type) => fileType?.includes(type)))
        : true;
    },
    isItemRelevant(driveItem) {
      if (!driveItem?.file) {
        return false;
      }
      return !this.folder || driveItem?.parentReference?.id === this.folder;
    },
  },
  sampleEmit,
};
