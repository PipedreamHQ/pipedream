const slack = require('https://github.com/PipedreamHQ/pipedream/components/slack/slack.app.js')

module.exports = {
  name: "Slack - New Message In Channel",
  dedupe: "unique",
  props: {
    slack,
    channels: {
      type: "string[]",
      label: "Channels",
      description: "Channels you'd like to receive notifications for.",
      optional: true,
      async options({ page, prevContext }) {
        const { cursor } = prevContext
        return await this.slack.getChannels(cursor)
      },
    },
    slackApphook: {
      type: "$.interface.apphook",
      appProp: "slack",
      async eventNames() {
        return this.channels || []
      },
    },
    resolveNames: {
      type: "boolean",
      label: "Resolve names",
      description: "Resolve user and channel names (incurs extra API calls)",
      default: false,
    }
  },
  async run(event) {
    if (event.subtype != null) {
      // This source is designed to just emit an event for each new message received.
      // Due to inconsistencies with the shape of message_changed and message_deleted
      // events, we are ignoring them for now. If you want to handle these types of
      // events, feel free to change this code!!
      console.log("Ignoring message with subtype.")
      return
    }
    if (this.resolveNames) {
      let info = await this.slack.sdk().users.info({ user: event.user })
      if (info.ok) {
        event.user_id = event.user
        event.user = info.user.real_name
      } else {
        event.user_lookup_error = info.error
      }
      info = await this.slack.sdk().conversations.info({ channel: event.channel })
      if (info.ok) {
        event.channel_id = event.channel
        event.channel = info.channel.name
      } else {
        event.channel_lookup_error = info.error
      }
      try {
        info = await this.slack.sdk().team.info({ team: event.team })
        if (info.ok) {
          event.team_id = event.team
          event.team = info.team.name
        } else {
          event.team_lookup_error = info.error
        }
      } catch (err) {
        console.log("Error getting team name, probably need to re-connect the account at pipedream.com/apps")
      }
    }
    this.$emit(event, { id: event.client_msg_id })
  },
}
