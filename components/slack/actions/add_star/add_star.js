const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-add-star",
  name: "Add Star",
  description: "Add a star to an item on behalf of the authenticated user",
  version: "0.0.2",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "conversation" ] },
    timestamp: { propDefinition: [ slack, "timestamp" ] },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.stars.add({
        conversation: this.conversation,
        timestamp: this.timestap, optional: true
    })
  },
}