const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-upload-file",
  name: "Upload File",
  description: "Upload a file",
  version: "0.0.29",
  type: "action",
  props: {
    slack,
    content: { propDefinition: [ slack, "content" ] },
    initial_comment: { propDefinition: [ slack, "initial_comment" ] }, optional: true
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.files.info({
        content: this.content,
        channel: this.conversation,
        initial_comment: this.initial_comment
    })
  },
}