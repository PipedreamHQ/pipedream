const dropbox = require('https://github.com/PipedreamHQ/pipedream/components/dropbox/dropbox.app.js')

module.exports = {
  name: "new-file",
  props: {
    dropbox,
    path: { propDefinition: [dropbox, "path"]},
    recursive: { propDefinition: [dropbox, "recursive"]},
    dropboxApphook: {
      type: "$.interface.apphook",
      appProp: "dropbox",
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      let startTime = new Date()
      await this.dropbox.initState(this)
      this.db.set("last_file_mod_time", startTime)
    }
  },
  async run(event) {
    const lastFileModTime = this.db.get("last_file_mod_time")
    let currFileModTime = ""
    let updates = await this.dropbox.getUpdates(this)
    for(update of updates) {
      if (update[".tag"] == "file") {
        if (update.server_modified > currFileModTime) {
          currFileModTime = update.server_modified
        }
        try {
          let revisions = await this.dropbox.sdk().filesListRevisions({
            path: update.id,
            mode: { ".tag": "id" },
            limit: 10,
          })
          if (revisions.entries.length > 1) {
            let oldest = revisions.entries.pop()
            if (lastFileModTime && lastFileModTime >= oldest.client_modified) {
              continue
            }
          }
        } catch(err) {
          console.log(err)
          throw(`Error looking up revisions for file: ${update.name}`)
        }
        this.$emit(update)
      }
    }
    if (currFileModTime != "") {
      this.db.set("last_file_mod_time", currFileModTime)
    }
  },
}
