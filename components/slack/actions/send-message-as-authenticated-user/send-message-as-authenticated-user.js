const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-send-message-as-authenticated-user",
  name: "Send Message as the Authenticated User",
  description: "Send a message as the authenticated user to a channel, group or user.",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "conversation" ] },
    text: { propDefinition: [ slack, "text" ] },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.chat.postMessage({
      text: this.text,
      channel: this.conversation,
      as_user: true,
    })
  },
}