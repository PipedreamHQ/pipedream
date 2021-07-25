const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-list-channels",
  name: "List Channels",
  description: "Return a list of all channels in a workspace",
  version: "0.0.16",
  type: "action",
  props: {
    slack,
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.conversations.list()
  },
}