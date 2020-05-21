const Dropbox = require('dropbox').Dropbox
const fetch = require('isomorphic-fetch')

module.exports = {
  type: "app",
  app: "dropbox",
  propDefinitions: {
    path: {
      type: "string",
      label: "Path",
      description: "Path to the folder you want to watch for changes.",
      optional: false,
      useQuery: true,
      async options({ query }) {
        return await this.pathOptions(query)
      },
    },
    recursive: {
      type: "boolean",
      label: "Recursive",
      description: "Also watch sub-directories and their contents.",
      optional: true,
      default: false,
    },
  },
  methods: {
    sdk() {
      return new Dropbox({ accessToken: this.$auth.oauth_access_token, fetch })
    },
    async pathOptions(path) {
      const limit = 50
      let options = []
      let entries, has_more, cursor
      path = (path == "/" ? "" : path)
      try {
        const sdk = this.sdk()
        let files = await sdk.filesListFolder({ path, limit })
        do {
          ({ entries, has_more, cursor } = files)
          for(entry of entries) {
            if (entry[".tag"] == "folder") {
              options.push(entry.path_display)
            }
          }
          // TODO break after a certain number of folders has been found??
          if (has_more) {
            files = await sdk.filesListFolderContinue({ cursor })
          }
        } while(has_more)
        options = options.sort((a, b) => { return a.toLowerCase().localeCompare(b.toLowerCase()) })
        if (path) {
          options.unshift(require("path").dirname(path))
        }
        options.unshift(path)
      } catch (err) {
        console.log(err)
        throw(`Error connecting to Dropbox API to get directory listing for path: ${path}`)
      }
      return { options }
    },
    async initState(context) {
      const { path, recursive, db } = context
      try {
        let fixedPath = (path == "/" ? "" : path)
        let { cursor } = await this.sdk().filesListFolderGetLatestCursor({ path: fixedPath, recursive })
        const state = { path, recursive, cursor }
        db.set("dropbox_state", state)
        return state
      } catch(err) {
        console.log(err)
        throw(`Error connecting to Dropbox API to get latest cursor for folder: ${path}${recursive ? " (recursive)" : ""}`)
      }
    },
    async getState(context) {
      const { path, recursive, db } = context
      let state = db.get("dropbox_state")
      if (state == null || state.path != path || state.recursive != recursive) {
        state = await this.initState(context)
      }
      return state
    },
    async getUpdates(context) {
      let ret = []
      const state = await this.getState(context)
      if (state) {
        try {
          const { dropbox, db } = context
          let [cursor, has_more, entries] = [state.cursor, true, null]
          while(has_more) {
            ({ entries, cursor, has_more } = await this.sdk().filesListFolderContinue({ cursor }))
            ret = ret.concat(entries)
          }
          state.cursor = cursor
          db.set("dropbox_state", state)
        } catch(err) {
          console.log(err)
          throw(`Error connecting to Dropbox API to get list of updated files/folders for cursor: ${state.cursor}`)
        }
      }
      return ret
    },
  },
}
