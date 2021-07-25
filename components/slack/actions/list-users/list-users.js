const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-list-users",
  name: "List Users",
  description: "Return a list of all users in a workspace",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.users.list()
  },
}