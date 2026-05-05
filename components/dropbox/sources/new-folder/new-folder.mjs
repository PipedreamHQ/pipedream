import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "dropbox-new-folder",
  name: "New Folder",
  version: "0.0.20",
  description: "Emit new event when a new folder is created. Make sure the number of files/folders in the watched folder does not exceed 4000.",
  hooks: {
    async activate() {
      await this.getHistoricalEvents([
        "folder",
      ]);
      const state = await this.dropbox.initState(this);
      this._setDropboxState(state);
    },
  },
  async run() {
    const state = this._getDropboxState();
    const {
      ret: updates, state: newState,
    } = await this.dropbox.getUpdates(this, state);
    this._setDropboxState(newState);
    for (const update of updates) {
      if (update[".tag"] !== "folder") {
        continue;
      }
      this.$emit(update, this.getMeta(update.id, update.path_display || update.id));
    }
  },
  sampleEmit,
};
