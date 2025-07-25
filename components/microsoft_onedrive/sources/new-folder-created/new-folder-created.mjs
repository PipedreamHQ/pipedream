import base from "../common/base.mjs";
import onedrive from "../../microsoft_onedrive.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-folder-created",
  name: "New Folder Created (Instant)",
  description: "Emit new event when a new folder is created in a OneDrive drive",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...base.props,
    drive: {
      propDefinition: [
        onedrive,
        "drive",
      ],
      description: "The drive to monitor for new folders. If not specified, the personal OneDrive will be monitored.",
      optional: true,
    },
    folder: {
      propDefinition: [
        onedrive,
        "folder",
        ({ drive }) => ({
          driveId: drive,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    ...base.methods,
    getDeltaLinkParams() {
      const params = {};
      if (this.drive) {
        params.driveId = this.drive;
      }
      if (this.folder) {
        params.folderId = this.folder;
      }
      return params;
    },
    isItemRelevant(driveItem) {
      return !!(driveItem.folder);
    },
  },
  sampleEmit,
};
