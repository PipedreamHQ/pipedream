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
    async ls(path) {
      console.log("ls", path)
      let dbx = new Dropbox({ accessToken: this.$auth.oauth_access_token })
      dbx.filesListFolder({ path })
        .then(function(response) {
          console.log("SUCCESS", response)
        })
        .catch(function(error) {
          console.log("ERROR", error)
        });
    }
  },
}
