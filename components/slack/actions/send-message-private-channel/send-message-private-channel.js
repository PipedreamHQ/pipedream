const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-send-message-private-channel",
  name: "Send Message to a Private Channel",
  description: "Send a message to a private channel and customize the name and avatar of the bot that posts the message.",
  version: "0.0.2",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "privateChannel" ] },
    text: { propDefinition: [ slack, "text" ] },
    as_user: { propDefinition: [ slack, "as_user" ] },
    username: { propDefinition: [ slack, "username" ], description: "Optionally customize your bot's username (default is `Pipedream`)." },
    icon_emoji: { propDefinition: [ slack, "icon_emoji" ], description: "Optionally use an emoji as the bot icon for this message (e.g., `:fire:`). This value overrides `icon_url` if both are provided." },
    icon_url: { propDefinition: [ slack, "icon_url" ], description: "Optionally provide an image URL to use as the bot icon for this message." },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.chat.postMessage({
      channel: this.conversation,
      text: this.text,
      as_user: this.as_user,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
    })
  },
}