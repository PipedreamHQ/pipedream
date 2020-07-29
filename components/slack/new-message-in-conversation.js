const slack = require('https://github.com/PipedreamHQ/pipedream/components/slack/slack.app.js')


module.exports = {
  name: "Slack - New Message In Conversation(s)",
  dedupe: "unique",
  props: {
    slack,
    conversations: {
      type: "string[]",
      label: "Conversations",
      description: "Conversations you'd like to receive notifications for.",
      optional: true,
      async options({ prevContext }) {
        let { types, cursor, userNames } = prevContext
        if (types == null) {
          const scopes = await this.slack.scopes()
          types = ["public_channel"]
          if (scopes.includes("groups:read")) {
            types.push("private_channel")
          }
          if (scopes.includes("mpim:read")) {
            types.push("mpim")
          }
          if (scopes.includes("im:read")) {
            types.push("im")
            // TODO use paging
            userNames = {}
            for (const user of (await this.slack.users()).users) {
              userNames[user.id] = user.name
            }
          }
        }
        const resp = await this.slack.availableConversations(types.join(), cursor)
        return {
          options: resp.conversations.map((c) => {
            if (c.is_im) {
              return { label: `Direct messaging with: @${userNames[c.user]}`, value: c.id }
            } else if (c.is_mpim) {
              return { label: c.purpose.value, value: c.id }
            } else {
              return { label: `${c.is_private ? "Private" : "Public"} channel: ${c.name}`, value: c.id }
            }
          }),
          context: { types, cursor: resp.cursor, userNames },
        }
      },
    },
    slackApphook: {
      type: "$.interface.apphook",
      appProp: "slack",
      async eventNames() {
        return this.conversations || []
      },
    },
    ignoreMyself: {
      type: "boolean",
      label: "Ignore myself",
      description: "Ignore messages from me",
      default: true,
    },
    resolveNames: {
      type: "boolean",
      label: "Resolve names",
      description: "Resolve user and channel names (incurs extra API calls)",
      default: false,
    },
    nameCache: "$.service.db",
  },
  methods: {
    async getName(type, key, id, format, timeout = 3600000) {
      const cacheKey = `${type}:${id}`
      let record = this.nameCache.get(cacheKey)
      const time = Date.now()
      if (record == null || time - record.ts > timeout) {
        try {
          const info = await this.slack.sdk()[type].info({ [key]: id })
          if (!info.ok) {
            throw info.error
          }
          record = { ts: time, val: await format(info) }
        } catch (err) {
          if (type == "team") {
            record = { ts: time, val: id }
          } else {
            throw err
          }
        }
        this.nameCache.set(cacheKey, record)
      }
      return record.val
    },
    async getUserName(id) {
      return this.getName('users', 'user', id, async (info) => {
        return info.user.name
      })
    },
    async getConversationName(id) {
      return this.getName('conversations', 'channel', id, async (info) => {
        if (info.channel.is_im) {
          return `DM with ${await this.getUserName(info.channel.user)}`
        } else {
          return info.channel.name
        }
      })
    },
    async getTeamName(id) {
      return this.getName('team', 'team', id, async (info) => {
        return info.team.name
      })
    },
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
    if (this.ignoreMyself && event.user == this.slack.mySlackId()) {
      return
    }
    if (this.resolveNames) {
      event.user_id = event.user
      event.user = await this.getUserName(event.user)
      event.channel_id = event.channel
      event.channel = await this.getConversationName(event.channel)
      event.team_id = event.team
      event.team = await this.getTeamName(event.team)
    }

    this.$emit(event, { id: event.client_msg_id })
  },
}
