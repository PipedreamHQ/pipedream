const dropbox = require('../../dropbox.app.js')

module.exports = {
  key: "dropbox-new-or-modified-file-or-folder",
  name: "New or Modified File or Folder",
  version: "0.0.1",
  description: "Emits an event when a file or folder is added or modified. Make sure the number of files/folders in the watched folder does not exceed 4000.",
  props: {
    dropbox,
    path: { propDefinition: [dropbox, "path"]},
    recursive: { propDefinition: [dropbox, "recursive"]},
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
      await this.dropbox.initState(this)
    }
  },
  async run(event) {
    let updates = await this.dropbox.getUpdates(this)
    for(update of updates) {
      if (update[".tag"] == "file") {
        if (this.includeMediaInfo) {
          update = await this.dropbox.sdk().filesGetMetadata({
            path: update.path_lower,
            include_media_info: true,
          })
          if (update.result) {
            update = update.result
          }
        }
        if (this.includeLink) {
          let response = await this.dropbox.sdk().filesGetTemporaryLink({
            path: update.path_lower,
          })
          if (response.result) {
            response = response.result
          }
          const { link, metadata } = response
          update.link = link
        }
      }
      this.$emit(update)
    }
  },
}
