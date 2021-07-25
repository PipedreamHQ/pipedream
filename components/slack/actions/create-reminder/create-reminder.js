const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-create-reminder",
  name: "Create Reminder",
  description: "Create a reminder",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    text: { propDefinition: [ slack, "text" ] },
    timestamp: { propDefinition: [ slack, "timestamp" ] },
    team_id: { propDefinition: [ slack, "team_id" ] },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.reminders.complete({
        text: this.text,
        team_id: this.team_id,
        timestamp: this.timestamp
    })
  },
}