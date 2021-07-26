const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-leave-channel",
  name: "Leave Channel",
  description: "Leave an existing channel",
  version: "0.0.2",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "conversation" ] }
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.conversations.leave({
        channel: this.conversation
    })
  },
}