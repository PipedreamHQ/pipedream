const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-remove-star",
  name: "Remove Star",
  description: "Remove a star from an item on behalf of the authenticated user",
  version: "0.0.5",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "conversation" ], optional: true },
    timestamp: { propDefinition: [ slack, "timestamp" ], optional: true },
    file: { propDefinition: [ slack, "file" ], optional: true },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.stars.remove({
        conversation: this.conversation,
        timestamp: this.timestamp, optional: true,
        file: this.file
    })
  },
}