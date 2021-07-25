const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {
  key: "slack-set-channel-purpose",
  name: "Set Channel Purpose",
  description: "Change the purpose of a channel.",
  version: "0.0.11",
  type: "action",
  props: {
    slack,
      conversation: { propDefinition: [ slack, "conversation" ] },
      purpose: { propDefinition: [ slack, "purpose" ] },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
      return await web.conversations.setPurpose({
        channel: this.conversation,
        purpose: this.purpose,
      })
  },
}
