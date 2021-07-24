const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-invite-user-to-public-channel",
  name: "Invite User to Public Channel ",
  description: "Invite an existing user to an existing public channel",
  version: "0.0.14",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "publicChannel" ] },
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