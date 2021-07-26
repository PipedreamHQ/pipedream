const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-kick-user",
  name: "Kick User",
  description: "Remove a user from a conversation",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "conversation" ] },
    user: { propDefinition: [ slack, "user" ] } 
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.conversations.kick({
        conversation: this.conversation,
        user: this.user
    })
  },
}