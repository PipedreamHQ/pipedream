const slack = require('https://github.com/PipedreamHQ/pipedream/components/slack/slack.app.js')

async function getUserName(nameCache, sdk, id) {
  const { users } = nameCache
  if (users[id] == null) {
    const info = await sdk.users.info({ user: id })
    if (info.ok) {
      users[id] = info.user.name
    } else {
      throw info.error
    }
  }
  return users[id]
}

async function getConversationName(nameCache, sdk, id, username) {
  const { users, conversations } = nameCache
  if (conversations[id] == null) {
    const info = await sdk.conversations.info({ channel: id })
    if (info.ok) {
      if (info.channel.is_im) {
        conversations[id] = `DM with ${await getUserName(nameCache, sdk, info.channel.user)}`
      } else {
        conversations[id] = info.channel.name
      }
    } else {
      throw info.error
    }
  }
  return conversations[id]
}

async function getTeamName(nameCache, sdk, id) {
  const { teams } = nameCache
  if (teams[id] == null) {
    try {
      const info = await sdk.team.info({ team: id })
      if (info.ok) {
        teams[id] = info.team.name
      } else {
        throw info.error
      }
    } catch(err) {
      console.log("Error getting team name, probably need to re-connect the account at pipedream.com/apps", err)
      teams[id] = id
    }
  }
  return teams[id]
}

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
      // invalidate old cache entries after an hour
      const cacheTime = this.nameCache.get("cache_time")
      if (cacheTime == null || Date.now() - cacheTime > 3600000) {
        this.nameCache.set("slack_entity_names", { users: {}, conversations: {}, teams: {} })
        this.nameCache.set("cache_time", Date.now())
      }
      const nameCache = this.nameCache.get("slack_entity_names")

      event.user_id = event.user
      event.user = await getUserName(nameCache, this.slack.sdk(), event.user)
      event.channel_id = event.channel
      event.channel = await getConversationName(nameCache, this.slack.sdk(), event.channel)
      event.team_id = event.team
      event.team = await getTeamName(nameCache, this.slack.sdk(), event.team)

      this.nameCache.set("slack_entity_names", nameCache)
    }

    this.$emit(event, { id: event.client_msg_id })
  },
}
