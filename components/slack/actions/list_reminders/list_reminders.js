const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-list-reminders",
  name: "List Reminders",
  description: "List all reminders for a given user",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    team_id: { propDefinition: [ slack, "team_id" ], optional: true },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.reminders.list({
        team_id: this.team_id
    })
  },
}