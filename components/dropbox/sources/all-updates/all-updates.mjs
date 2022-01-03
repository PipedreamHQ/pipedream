import dropbox from "../../dropbox.app.mjs";

export default {
  key: "dropbox-all-updates",
  name: "New or Modified File or Folder",
  version: "0.0.5",
  description: "Emits an event when a file or folder is added or modified. Make sure the number of files/folders in the watched folder does not exceed 4000.",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "pathFolder",
        () => ({
          returnSimpleString: true,
        }),
      ],
    },
    recursive: {
      propDefinition: [
        dropbox,
        "recursive",
      ],
    },
    includeMediaInfo: {
      type: "boolean",
      description: "Emit media info for photo and video files (incurs an additional API call)",
      default: false,
    },
    includeLink: {
      type: "boolean",
      description: "Emit temporary download link for files (incurs an additional API call)",
      default: false,
    },
    dropboxApphook: {
      type: "$.interface.apphook",
      appProp: "dropbox",
      static: [],
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      await this.dropbox.initState(this);
    },
  },
  methods: {
    getMeta(id, summary) {
      return {
        id,
        summary,
        tz: Date.now(),
      };
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
