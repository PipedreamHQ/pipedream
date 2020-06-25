const dropbox = require('https://github.com/PipedreamHQ/pipedream/components/dropbox/dropbox.app.js')

module.exports = {
  name: "Dropbox - New Folder Created",
  props: {
    dropbox,
    path: { propDefinition: [dropbox, "path"]},
    recursive: { propDefinition: [dropbox, "recursive"]},
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
      if (update[".tag"] == "folder") {
        this.$emit(update)
      }
    }
  },
}
