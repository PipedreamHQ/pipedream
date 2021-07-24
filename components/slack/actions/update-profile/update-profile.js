const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-update-profile",
  name: "Update Profile",
  description: "Update basic profile field such as name or title.",
  version: "0.0.14",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "user" ] },
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