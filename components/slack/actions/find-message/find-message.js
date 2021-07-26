const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')
module.exports = {  
  key: "slack-find-message",
  name: "Find Message",
  description: "Find a Slack message.",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    query: { propDefinition: [ slack, "query" ] },
    count: { propDefinition: [ slack, "count" ], optional: true },
    team_id: { propDefinition: [ slack, "team_id" ], optional: true },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.search.messages({
        query: this.query,
        count: this.count,
    })
  },
}