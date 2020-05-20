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
        options.push("/")
      }
      return { options }
    },
  },
}
