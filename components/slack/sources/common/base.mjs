import slack from "../../slack.app.mjs";

export default {
  props: {
    slack,
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
    async getUserName(id) {
      return this.maybeCached(`users:${id}`, async () => {
        const info = await this.slack.sdk().users.info({
          user: id,
        });
        if (!info.ok) throw new Error(info.error);
        return info.user.name;
      });
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
    async getConversationName(id) {
      return this.maybeCached(`conversations:${id}`, async () => {
        const info = await this.slack.sdk().conversations.info({
          channel: id,
        });
        if (!info.ok) throw new Error(info.error);
        if (info.channel.is_im) {
          return `DM with ${await this.getUserName(info.channel.user)}`;
        }
        return info.channel.name;
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
          console.log("Error getting team name, probably need to re-connect the account at pipedream.com/apps!!!", err);
          return id;
        }
      });
    },
    async getLastMessage({
      channel, event_ts,
    }) {
      return this.maybeCached(`lastMessage:${channel}:${event_ts}`, async () => {
        const info = await this.slack.sdk().conversations.history({
          channel,
          latest: event_ts,
          limit: 1,
          inclusive: true,
        });
        return info;
      });
    },
    processEvent(event) {
      return event;
    },
  },
  async run(event) {
    event = await this.processEvent(event);

    if (event) {
      if (!event.client_msg_id) {
        event.pipedream_msg_id = `pd_${Date.now()}_${Math.random().toString(36)
          .substr(2, 10)}`;
      }

      this.$emit(event, {
        id: event.client_msg_id || event.pipedream_msg_id,
        summary: this.getSummary(event),
        ts: event.event_ts || Date.now(),
      });
    }
  },
};
