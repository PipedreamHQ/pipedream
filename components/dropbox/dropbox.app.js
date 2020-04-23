const axios = require('axios')
const fetch = require('isomorphic-fetch')
const Dropbox = require('dropbox').Dropbox

module.exports = {
  type: "app",
  app: "dropbox",
  propDefinitions: {
    path: {
      type: "string",
      label: 'Path to file to show listing for',
      description: "Path to the file in your dropbox account that you want to show a listing for",
    },
  },
  methods: {
    async ls(path = "", recursive = false) {
      if ("/" == path) {
        path = ""
      }
      console.log("ls", path)
      let dbx = new Dropbox({ accessToken: this.$auth.oauth_access_token })
      try {
        let files = await dbx.filesListFolder({ path, recursive })
        console.log("SUCCESS", files)
        return files
      } catch (err) {
        console.log("ERROR", err)
      }
    },
    async ls_continue(cursor) {
      let dbx = new Dropbox({ accessToken: this.$auth.oauth_access_token })
      try {
        let files = await dbx.filesListFolderContinue({ cursor })
        console.log("SUCCESS", files)
        return files
      } catch (err) {
        console.log("ERROR", err)
      }
    }
  },
}
