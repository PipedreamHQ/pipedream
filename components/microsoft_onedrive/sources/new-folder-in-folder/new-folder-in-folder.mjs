import base from "../new-file/new-file.mjs";
import onedrive from "../../microsoft_onedrive.app.mjs";

const {
  props,
  methods,
  hooks,
  run,
} = base;

export default {
  type: "source",
  key: "microsoft_onedrive-new-folder-in-folder",
  name: "New Folder in Folder (Instant)",
  description: "Emit an event when a new folder is created under a directory tree in a OneDrive drive",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...props,
    folder: {
      propDefinition: [
        onedrive,
        "folder",
      ],
    },
  },
  methods: {
    ...methods,
    getDeltaLinkParams() {
      return {
        folderId: this.folder,
      };
    },
    isItemRelevant(driveItem) {
      return !!(driveItem.folder) && driveItem.parentReference?.path !== "/drive/root:";
    },
    generateMeta(driveItem) {
      const {
        id,
        createdDateTime,
        name,
      } = driveItem;
      const summary = `New folder: ${name}`;
      const ts = Date.parse(createdDateTime);
      return {
        id,
        summary,
        ts,
      };
    },
  },
  hooks,
  run,
};
