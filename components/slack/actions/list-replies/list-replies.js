const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-list-replies",
  name: "List Replies",
  description: "Retrieve a thread of messages posted to a conversation.",
  version: "0.0.2",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "conversation" ] },
    timestamp: { propDefinition: [ slack, "timestamp" ] },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.conversations.replies({
        channel: this.conversation,
        ts: this.timestamp,
    })
  },
}