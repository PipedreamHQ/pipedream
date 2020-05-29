const dropbox = require('https://github.com/PipedreamHQ/pipedream/components/dropbox/dropbox.app.js')

module.exports = {
  name: "Dropbox - All File and Folder Updates",
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
        }
        if (this.includeLink) {
          const { link, metadata } = await this.dropbox.sdk().filesGetTemporaryLink({
            path: update.path_lower,
          })
          update.link = link
        }
      }
      this.$emit(update)
    }
  },
}
