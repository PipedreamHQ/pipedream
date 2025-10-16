import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "dropbox-all-updates",
  name: "New or Modified File or Folder",
  version: "0.0.19",
  description: "Emit new event when a file or folder is added or modified. Make sure the number of files/folders in the watched folder does not exceed 4000.",
  props: {
    ...common.props,
    includeMediaInfo: {
      label: "Include Media Info",
      type: "boolean",
      description: "Emit media info for photo and video files (incurs an additional API call)",
      default: false,
    },
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Emit temporary download link for files (incurs an additional API call)",
      default: false,
    },
  },
  hooks: {
    async activate() {
      await this.getHistoricalEvents(this.getFileTypes());
      const state = await this.dropbox.initState(this);
      this._setDropboxState(state);
    },
  },
  methods: {
    ...common.methods,
    getFileTypes() {
      return [
        "file",
        "folder",
      ];
    },
  },
  async run() {
    const state = this._getDropboxState();
    const {
      ret: updates, state: newState,
    } = await this.dropbox.getUpdates(this, state);
    this._setDropboxState(newState);
    for (let update of updates) {
      let file = {
        ...update,
      };
      const fileTypes = this.getFileTypes();
      if (!fileTypes.includes(file[".tag"])) {
        continue;
      }
      if (this.includeMediaInfo && file[".tag"] === "file") {
        file = await this.getMediaInfo(update);
      }
      if (this.includeLink && file[".tag"] === "file") {
        file.link = await this.getTemporaryLink(update);
      }
      // new unique identification from merging the file id and the last file revision
      const id = update[".tag"] === "file"
        ? `${file.id}-${file.rev}`
        : `${file.id}-${newState.cursor}`;
      this.$emit(file, this.getMeta(id, file.path_display || file.id));
    }
  },
  sampleEmit,
};
