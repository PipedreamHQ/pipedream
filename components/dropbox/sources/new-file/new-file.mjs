import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "dropbox-new-file",
  name: "New File",
  version: "0.0.18",
  description: "Emit new event when a new file is added to your account or a specific folder. Make sure the number of files/folders in the watched folder does not exceed 4000.",
  props: {
    ...common.props,
    includeMediaInfo: {
      label: "Include Media Info",
      type: "boolean",
      description: "Emit media info for photos and videos (incurs an additional API call)",
      default: false,
    },
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Emit temporary download link to file (incurs an additional API call)",
      default: false,
    },
  },
  hooks: {
    async activate() {
      await this.getHistoricalEvents([
        "file",
      ]);
      const startTime = new Date();
      const state = await this.dropbox.initState(this);
      this._setLastFileModTime(startTime);
      this._setDropboxState(state);
    },
  },
  methods: {
    ...common.methods,
    _setLastFileModTime(time) {
      this.db.set("last_file_mod_time", time);
    },
    _getLastFileModTime() {
      return this.db.get("last_file_mod_time");
    },
  },
  async run() {
    const lastFileModTime = this._getLastFileModTime();
    const state = this._getDropboxState();
    let currFileModTime = "";
    const {
      ret: updates, state: newState,
    } = await this.dropbox.getUpdates(this, state);
    this._setDropboxState(newState);
    for (let update of updates) {
      let file = {
        ...update,
      };
      if (update[".tag"] !== "file") {
        continue;
      }
      if (update.server_modified > currFileModTime) {
        currFileModTime = update.server_modified;
      }
      const isNewFile = await this.isNewFile(update, lastFileModTime);
      if (!isNewFile) {
        continue;
      }
      if (this.includeMediaInfo) {
        file = await this.getMediaInfo(update);
      }
      if (this.includeLink) {
        file.link = await this.getTemporaryLink(update);
      }
      this.$emit(file, this.getMeta(file.id, file.path_display || file.id));
    }
    if (currFileModTime != "") {
      this._setLastFileModTime(currFileModTime);
    }
  },
  sampleEmit,
};
