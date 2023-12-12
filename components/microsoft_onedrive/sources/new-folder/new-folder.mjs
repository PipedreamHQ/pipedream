import base from "../new-file/new-file.mjs";

export default {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-folder",
  name: "New Folder (Instant)",
  description: "Emit new event when a new folder is created in a OneDrive drive",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...base.methods,
    isItemRelevant(driveItem) {
      return !!(driveItem.folder);
    },
  },
};
