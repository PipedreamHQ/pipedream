import common from "../common.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "dropbox-new-folder",
  name: "New Folder",
  version: "0.0.7",
  description: "Emit new event when a new folder is created. Make sure the number of files/folders in the watched folder does not exceed 4000.",
  async run() {
    const updates = await this.dropbox.getUpdates(this);
    for (const update of updates) {
      if (update[".tag"] !== "folder") {
        continue;
      }
      this.$emit(update, this.getMeta(update.id, update.path_display || update.id));
    }
  },
};
