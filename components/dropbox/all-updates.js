const dropbox = require('https://github.com/PipedreamHQ/pipedream/components/dropbox/dropbox.app.js')

module.exports = {
  name: "all-updates",
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
    let updates = await getUpdates(this)
    for(update of updates) {
      // TODO further filtering for different use cases here
      this.$emit(update)
    }
  },
}

async function initState(context) {
  const { path, recursive, dropbox, db } = context
  try {
    let fixedPath = (path == "/" ? "" : path)
    let { cursor } = await dropbox.sdk().filesListFolderGetLatestCursor({ path: fixedPath, recursive })
    const state = { path, recursive, cursor }
    db.set("dropbox_state", state)
    return state
  } catch(err) {
    console.log(err)
    throw(`Error getting latest cursor for folder: ${path}${recursive ? " (recursive)" : ""}`)
  }
}

async function getState(context) {
  const { path, recursive, dropbox, db } = context
  let state = db.get("dropbox_state")
  if (state == null || state.path != path || state.recursive != recursive) {
    state = await initState(context)
  }
  return state
}

async function getUpdates(context) {
  let ret = []
  const state = await getState(context)
  if (state) {
    try {
      const { dropbox, db } = context
      let [cursor, has_more, entries] = [state.cursor, true, null]
      while(has_more) {
        ({ entries, cursor, has_more } = await dropbox.sdk().filesListFolderContinue({ cursor }))
        ret = ret.concat(entries)
      }
      state.cursor = cursor
      db.set("dropbox_state", state)
    } catch(err) {
      console.log(err)
      throw(`Error getting list of updated files/folders for cursor: ${state.cursor}`)
    }
  }
  return ret
}
