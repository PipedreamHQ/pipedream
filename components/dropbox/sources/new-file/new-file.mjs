import common from "../common.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "dropbox-new-file",
  name: "New File",
  version: "0.0.5",
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
      const startTime = new Date();
      await this.dropbox.initState(this);
      this._setLastFileModTime(startTime);
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
    let currFileModTime = "";
    const updates = await this.dropbox.getUpdates(this);
    for (let update of updates) {
      if (update[".tag"] == "file") {
        if (update.server_modified > currFileModTime) {
          currFileModTime = update.server_modified;
        }
        try {
          const dpx = await this.dropbox.sdk();
          let revisions = await dpx.filesListRevisions({
            path: update.id,
            mode: {
              ".tag": "id",
            },
            limit: 10,
          });
          if (revisions.result) {
            revisions = revisions.result;
          }
          if (revisions.entries.length > 1) {
            const oldest = revisions.entries.pop();
            if (lastFileModTime && lastFileModTime >= oldest.client_modified) {
              continue;
            }
          }
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
        } catch (err) {
          console.log(err);
          throw `Error looking up revisions for file: ${update.name}`;
        }
        this.$emit(update, this.getMeta(update.id, update.path_display));
      }
    }
    if (currFileModTime != "") {
      this._setLastFileModTime(currFileModTime);
    }
  },
};
