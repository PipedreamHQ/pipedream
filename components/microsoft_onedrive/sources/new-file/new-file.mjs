import base from "../common/base.mjs";

export default {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-file",
  name: "New File (Instant)",
  description: "Emit new event when a new file is added to a specific drive in OneDrive",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    isItemTypeRelevant(driveItem) {
      return !driveItem.deleted;
    },
    isItemRelevant(driveItem) {
      return !!(driveItem.file);
    },
  },
};
