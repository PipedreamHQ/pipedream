const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-find-user-by-email",
  name: "Find User by Email",
  description: "Find a user by matching against their email",
  version: "0.0.14",
  type: "action",
  props: {
    slack,
    email: { type: "string" }
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.users.lookupByEmail({
      email: this.email
    })
  },
}