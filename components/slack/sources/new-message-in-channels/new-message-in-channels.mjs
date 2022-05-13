import slack from "../../slack.app.mjs";

export default {
  key: "slack-new-message-in-channels",
  name: "New Message In Channels",
  version: "0.0.4",
  description: "Emit new event when a new message is posted to one or more channels",
  type: "source",
  dedupe: "unique",
  props: {
    slack,
    conversations: {
      type: "string[]",
      label: "Channels",
      description: "Select one or more channels to monitor for new messages.",
      optional: true,
      async options({ prevContext }) {
        let {
          types,
          cursor,
          userNames,
        } = prevContext;
        if (types == null) {
          const scopes = await this.slack.scopes();
          types = [
            "public_channel",
          ];
          if (scopes.includes("groups:read")) {
            types.push("private_channel");
          }
          if (scopes.includes("mpim:read")) {
            types.push("mpim");
          }
          if (scopes.includes("im:read")) {
            types.push("im");
            // TODO use paging
            userNames = {};
            for (const user of (await this.slack.users()).users) {
              userNames[user.id] = user.name;
            }
          }
        }
        const resp = await this.slack.availableConversations(types.join(), cursor);
        return {
          options: resp.conversations.map((c) => {
            if (c.is_im) {
              return {
                label: `Direct messaging with: @${userNames[c.user]}`,
                value: c.id,
              };
            } else if (c.is_mpim) {
              return {
                label: c.purpose.value,
                value: c.id,
              };
            } else {
              const privacyProp = c.is_private ?
                "Private" :
                "Public";
              return {
                label: `${privacyProp} channel: ${c.name}`,
                value: c.id,
              };
            }
          }),
          context: {
            types,
            cursor: resp.cursor,
            userNames,
          },
        };
      },
    },
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    slackApphook: {
      type: "$.interface.apphook",
      appProp: "slack",
      async eventNames() {
        return this.conversations || [];
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
    ignoreBot: {
      type: "boolean",
      label: "Ignore bots",
      description: "Ignore messages from bots",
      default: false,
    },
    nameCache: "$.service.db",
  },
  methods: {
    async maybeCached(key, refreshVal, timeoutMs = 3600000) {
      let record = this.nameCache.get(key);
      const time = Date.now();
      if (!record || time - record.ts > timeoutMs) {
        record = {
          ts: time,
          val: await refreshVal(),
        };
        this.nameCache.set(key, record);
      }
      return record.val;
    },
    async getBotName(id) {
      return this.maybeCached(`bots:${id}`, async () => {
        const info = await this.slack.sdk().bots.info({
          bot: id,
        });
        if (!info.ok) throw new Error(info.error);
        return info.bot.name;
      });
    },
    async getUserName(id) {
      return this.maybeCached(`users:${id}`, async () => {
        const info = await this.slack.sdk().users.info({
          user: id,
        });
        if (!info.ok) throw new Error(info.error);
        return info.user.name;
      });
    },
    async getConversationName(id) {
      return this.maybeCached(`conversations:${id}`, async () => {
        const info = await this.slack.sdk().conversations.info({
          channel: id,
        });
        if (!info.ok) throw new Error(info.error);
        if (info.channel.is_im) {
          return `DM with ${await this.getUserName(info.channel.user)}`;
        } else {
          return info.channel.name;
        }
      });
    },
    async getTeamName(id) {
      return this.maybeCached(`team:${id}`, async () => {
        try {
          const info = await this.slack.sdk().team.info({
            team: id,
          });
          return info.team.name;
        } catch (err) {
          console.log("Error getting team name, probably need to re-connect the account at pipedream.com/apps", err);
          return id;
        }
      });
    },
  },
  async run(event) {
    if (event.subtype != null && event.subtype != "bot_message" && event.subtype != "file_share") {
      // This source is designed to just emit an event for each new message received.
      // Due to inconsistencies with the shape of message_changed and message_deleted
      // events, we are ignoring them for now. If you want to handle these types of
      // events, feel free to change this code!!
      console.log("Ignoring message with subtype.");
      return;
    }
    if (this.ignoreMyself && event.user == this.slack.mySlackId()) {
      return;
    }
    if (this.ignoreBot) {
      if (event.subtype == "bot_message" || event.bot_id) {
        return;
      }
    }
    if (this.resolveNames) {
      if (event.user) {
        event.user_id = event.user;
        event.user = await this.getUserName(event.user);
      } else if (event.bot_id) {
        event.bot = await this.getBotName(event.bot_id);
      }
      event.channel_id = event.channel;
      event.channel = await this.getConversationName(event.channel);
      if (event.team) {
        event.team_id = event.team;
        event.team = await this.getTeamName(event.team);
      }
    }
    if (!event.client_msg_id) {
      event.pipedream_msg_id = `pd_${Date.now()}_${Math.random().toString(36)
        .substr(2, 10)}`;
    }

    this.$emit(event, {
      id: event.client_msg_id || event.pipedream_msg_id,
    });
  },
};
