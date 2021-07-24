const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-invite-user-to-private-channel",
  name: "Invite User to Private Channel ",
  description: "Invite an existing user to an existing private channel",
  version: "0.0.14",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "privateChannel" ] },
    text: { propDefinition: [ slack, "text" ] },
    user: { propDefinition: [ slack, "user" ] }

  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.chat.postMessage({
      channel: this.conversation,
      users: this.user
    })
  },
}