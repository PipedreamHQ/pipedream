const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-send-message",
  name: "Send Message (Simple)",
  description: "Send a message to a channel, group or user",
  version: "0.0.9",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "conversation" ] },
    text: { propDefinition: [ slack, "text" ] },
    username: { propDefinition: [ slack, "username" ], description: "Optionally customize your bot's username (default is `Pipedream`)." },
    icon_emoji: { propDefinition: [ slack, "icon_emoji" ], description: "Optionally use an emoji as the bot icon for this message (e.g., `:fire:`). This value overrides `icon_url` if both are provided." },
    icon_url: { propDefinition: [ slack, "icon_url" ], description: "Optionally provide an image URL to use as the bot icon for this message." },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.chat.postMessage({
      channel: this.conversation,
      text: this.text,
      as_user: false,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
    })
  },
}