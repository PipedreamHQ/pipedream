const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-send-message",
  name: "Send Message (Simple)",
  description: "Send a message to a channel, group or user",
  version: "0.0.8",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "conversation" ] },
    text: { propDefinition: [ slack, "text" ] },
    as_user: { propDefinition: [ slack, "as_user" ] },
    username: { propDefinition: [ slack, "username" ] },
    icon_emoji: { propDefinition: [ slack, "icon_emoji" ] },
    icon_url: { propDefinition: [ slack, "icon_url" ]  },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.chat.postMessage({
      text: this.text,
      channel: this.conversation,
      as_user: this.as_user,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
    })
  },
}