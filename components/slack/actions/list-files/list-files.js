const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-list-files",
  name: "List Files",
  description: "Return a list of files within a team",
  version: "0.0.25",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "conversation" ] }
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.files.list({
        channel: this.conversation
    })
  },
}