import base from "../new-file/new-file.mjs";

const {
  props,
  methods,
  hooks,
  run,
} = base;

export default {
  type: "source",
  key: "microsoft_onedrive-new-folder",
  name: "New Folder (Instant)",
  description: "Emit new event when a new folder is created in a OneDrive drive",
  version: "0.0.1",
  dedupe: "unique",
  props,
  methods: {
    ...methods,
    isItemTypeRelevant(driveItem) {
      return (
        !!driveItem.folder &&
        methods.isItemTypeRelevant.call(this, driveItem)
      );
    },
  },
  hooks,
  run,
};
