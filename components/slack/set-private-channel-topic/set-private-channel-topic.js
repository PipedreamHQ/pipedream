const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {
  key: "slack-set-private-channel-topic",
  name: "Set Private Channel Topic",
  description: "Set the topic on a selected private channel.",
  version: "0.0.14",
  type: "action",
  props: {
    slack,
      conversation: { propDefinition: [ slack, "privateChannel" ] },
      topic: { propDefinition: [ slack, "topic" ] },
      as_user: { propDefinition: [ slack, "as_user" ] },
      username: { propDefinition: [ slack, "username" ], description: "Optionally customize your bot's username (default is `Pipedream`)." },
      icon_emoji: { propDefinition: [ slack, "icon_emoji" ], description: "Optionally use an emoji as the bot icon for this message (e.g., `:fire:`). This value overrides `icon_url` if both are provided." },
      icon_url: { propDefinition: [ slack, "icon_url" ], description: "Optionally provide an image URL to use as the bot icon for this message." },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
      return await web.conversations.setTopic({
        channel: this.conversation,
        topic: this.text,
      })
  },
}
