const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-delete-file",
  name: "Delete File",
  description: "Delete a file",
  version: "0.0.2",
  type: "action",
  props: {
    slack,
    file: { propDefinition: [ slack, "file" ] }
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.files.delete({
        file: this.file
    })
  },
}