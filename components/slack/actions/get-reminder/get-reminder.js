const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-get-reminder",
  name: "Get Reminder",
  description: "Return information about a reminder",
  version: "0.0.32",
  type: "action",
  props: {
    slack,
    reminder: { propDefinition: [ slack, "reminder" ] }
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.reminders.info({
        reminder: this.reminder
    })
  },
}