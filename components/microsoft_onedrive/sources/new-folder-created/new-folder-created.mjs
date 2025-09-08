import base from "../common/base.mjs";
import onedrive from "../../microsoft_onedrive.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-folder-created",
  name: "New Folder Created (Instant)",
  description: "Emit new event when a new folder is created in a OneDrive drive",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...base.props,
    folder: {
      propDefinition: [
        onedrive,
        "folder",
      ],
      optional: true,
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
    isItemRelevant(driveItem) {
      return !!(driveItem.folder);
    },
  },
  sampleEmit,
};
