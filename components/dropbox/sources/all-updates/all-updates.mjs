import common from "../common.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "dropbox-all-updates",
  name: "New or Modified File or Folder",
  version: "0.0.7",
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
  async run() {
    const updates = await this.dropbox.getUpdates(this);
    for (let update of updates) {
      let file = {
        ...update,
      };
      if (update[".tag"] !== "file") {
        continue;
      }
      if (this.includeMediaInfo) {
        file = await this.getMediaInfo(update);
      }
      if (this.includeLink) {
        file.link = await this.getTemporaryLink(update);
      }
      // new unique identification from merging the file id and the last file revision
      const id = `${file.id}-${file.rev}`;
      this.$emit(file, this.getMeta(id, file.path_display || file.id));
    }
  },
};
