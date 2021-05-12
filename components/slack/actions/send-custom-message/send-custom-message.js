const slack = require('../../slack.app.js')
const { WebClient } = require('@slack/web-api')

module.exports = {  
  key: "slack-send-custom-message",
  name: "Send a Custom Message",
  description: "Customize advanced setttings and send a message to a channel, group or user.",
  version: "0.0.4",
  type: "action",
  props: {
    slack,
    conversation: { propDefinition: [ slack, "conversation" ] },
    text: { propDefinition: [ slack, "text" ] },
    attachments: { propDefinition: [ slack, "attachments" ] },
    unfurl_links: { propDefinition: [ slack, "unfurl_links" ] },
    unfurl_media: { propDefinition: [ slack, "unfurl_media" ] },
    parse: { propDefinition: [ slack, "parse" ] },
    as_user: { propDefinition: [ slack, "as_user" ] },
    username: { propDefinition: [ slack, "username" ] },
    icon_emoji: { propDefinition: [ slack, "icon_emoji" ] },
    icon_url: { propDefinition: [ slack, "icon_url" ] },
    mrkdwn: { propDefinition: [ slack, "mrkdwn" ] },
    blocks: { propDefinition: [ slack, "blocks" ] },
    link_names: { propDefinition: [ slack, "link_names" ] },
    reply_broadcast: { propDefinition: [ slack, "reply_broadcast" ] },
    thread_ts: { propDefinition: [ slack, "thread_ts" ] }, 
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token)
    return await web.chat.postMessage({
      text: this.text,
      channel: this.conversation,
      attachments: this.attachments,
      unfurl_links: this.unfurl_links,
      unfurl_media: this.unfurl_media,
      parse: this.parse,
      as_user: this.as_user,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
      mrkdwn: this.mrkdwn,
      blocks: this.blocks,
      link_names: this.link_names,
      reply_broadcast: this.reply_broadcast,
      thread_ts: this.thread_ts,
    })
  },
}