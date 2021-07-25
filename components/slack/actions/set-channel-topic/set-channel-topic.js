const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {
  key: "slack-set-channel-topic",
  name: "Set Channel Topic",
  description: "Set the topic on a selected public channel.",
  version: "0.0.15",
  type: "action",
  props: {
    slack,
      conversation: { propDefinition: [ slack, "conversation" ] },
      topic: { propDefinition: [ slack, "topic" ] },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
      return await web.conversations.setTopic({
        channel: this.conversation,
        topic: this.topic,
      })
  },
}
