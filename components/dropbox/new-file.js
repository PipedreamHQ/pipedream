const dropbox = require('https://github.com/PipedreamHQ/pipedream/components/dropbox/dropbox.app.js')

module.exports = {
  name: "new-file-in-folder",
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
      await initState(this)
    }
  },
  async run(event) {
    const lastFileModTime = this.db.get("last_file_mod_time")
    let currFileModTime = ""
    let updates = await getUpdates(this)
    for(update of updates) {
      if (update[".tag"] == "file") {
        if (update.server_modified > currFileModTime) {
          currFileModTime = update.server_modified
        }
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
        // TODO decorate with more info about the file
        this.$emit(update)
      }
    }
    if (currFileModTime != "") {
      this.db.set("last_file_mod_time", currFileModTime)
    }
  },
}

async function initState(context) {
  const { path, recursive, dropbox, db } = context
  let state = db.get("dropbox_state")
  if (state == null || state.path != path || state.recursive != recursive) {
    try {
      let fixedPath = (path == "/" ? "" : path)
      let { cursor } = await dropbox.sdk().filesListFolderGetLatestCursor({ path: fixedPath, recursive })
      state = { path, recursive, cursor }
      db.set("dropbox_state", state)
      db.set("last_file_mod_time", new Date())
    } catch(err) {
      state = null
    }
  }
  return state
}

async function getUpdates(context) {
  let ret = []
  const state = await initState(context)
  if (state) {
    try {
      const { dropbox, db } = context
      const sdk = dropbox.sdk()
      let [cursor, has_more, entries] = [state.cursor, true, null]
      while(has_more) {
        ({ entries, cursor, has_more } = await sdk.filesListFolderContinue({ cursor }))
        ret = ret.concat(entries)
      }
      state.cursor = cursor
      db.set("dropbox_state", state)
    } catch(err) {
    }
  }
  return ret
}
