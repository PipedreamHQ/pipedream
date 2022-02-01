import common from "../common.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "dropbox-all-updates",
  name: "New or Modified File or Folder",
  version: "0.0.5",
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
      if (update[".tag"] == "file") {
        if (this.includeMediaInfo) {
          const dpx = await this.dropbox.sdk();
          update = await dpx.filesGetMetadata({
            path: update.path_lower,
            include_media_info: true,
          });
          if (update.result) {
            update = update.result;
          }
        }
        if (this.includeLink) {
          const dpx = await this.dropbox.sdk();
          let response = await dpx.filesGetTemporaryLink({
            path: update.path_lower,
          });
          if (response.result) {
            response = response.result;
          }
          const { link } = response;
          update.link = link;
        }
      }
      this.$emit(update, this.getMeta(update.id, update.path_display || update.id));
    }
  },
};
