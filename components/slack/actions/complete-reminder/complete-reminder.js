const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-complete-reminder",
  name: "Complete Reminder",
  description: "Complete a reminder",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    reminder: { propDefinition: [ slack, "reminder" ] }
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.reminders.complete({
        reminder: this.reminder
    })
  },
}