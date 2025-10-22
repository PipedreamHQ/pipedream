import slack from "../../slack_v2.app.mjs";
import {
  NAME_CACHE_MAX_SIZE, NAME_CACHE_TIMEOUT,
} from "./constants.mjs";

export default {
  props: {
    slack,
    db: "$.service.db",
  },
  methods: {
    _getNameCache() {
      return this.db.get("nameCache") ?? {};
    },
    _setNameCache(cacheObj) {
      this.db.set("nameCache", cacheObj);
    },
    _getLastCacheCleanup() {
      return this.db.get("lastCacheCleanup") ?? 0;
    },
    _setLastCacheCleanup(time) {
      this.db.set("lastCacheCleanup", time);
    },
    cleanCache(cacheObj) {
      console.log("Initiating cache check-up...");
      const timeout = Date.now() - NAME_CACHE_TIMEOUT;

      const entries = Object.entries(cacheObj);
      let cleanArr = entries.filter(
        ([
          , { ts },
        ]) => ts > timeout,
      );
      const diff = entries.length - cleanArr.length;
      if (diff) {
        console.log(`Cleaned up ${diff} outdated cache entries.`);
      }

      if (cleanArr.length > NAME_CACHE_MAX_SIZE) {
        console.log(`Reduced the cache from ${cleanArr.length} to ${NAME_CACHE_MAX_SIZE / 2} entries.`);
        cleanArr = cleanArr.slice(NAME_CACHE_MAX_SIZE / -2);
      }

      const cleanObj = Object.fromEntries(cleanArr);
      return cleanObj;
    },
    getCache() {
      let cacheObj = this._getNameCache();

      const lastCacheCleanup = this._getLastCacheCleanup();
      const time = Date.now();

      const shouldCleanCache = time - lastCacheCleanup > NAME_CACHE_TIMEOUT / 2;
      if (shouldCleanCache) {
        cacheObj = this.cleanCache(cacheObj);
        this._setLastCacheCleanup(time);
      }

      return [
        cacheObj,
        shouldCleanCache,
      ];
    },
    async maybeCached(key, refreshVal) {
      let [
        cacheObj,
        wasUpdated,
      ] = this.getCache();
      let record = cacheObj[key];
      const time = Date.now();
      if (!record || time - record.ts > NAME_CACHE_TIMEOUT) {
        record = {
          ts: time,
          val: await refreshVal(),
        };
        cacheObj[key] = record;
        wasUpdated = true;
      }

      if (wasUpdated) {
        this._setNameCache(cacheObj);
      }

      return record.val;
    },
    async getUserName(id) {
      return this.maybeCached(`users:${id}`, async () => {
        const info = await this.slack.usersInfo({
          user: id,
        });
        if (!info.ok) throw new Error(info.error);
        return info.user.name;
      });
    },
    async getRealName(id) {
      return this.maybeCached(`users_real_names:${id}`, async () => {
        const info = await this.slack.usersInfo({
          user: id,
        });
        if (!info.ok) throw new Error(info.error);
        return info.user.real_name;
      });
    },
    async getBotName(id) {
      return this.maybeCached(`bots:${id}`, async () => {
        const info = await this.slack.getBotInfo({
          bot: id,
        });
        if (!info.ok) throw new Error(info.error);
        return info.bot.name;
      });
    },
    async getConversationName(id) {
      return this.maybeCached(`conversations:${id}`, async () => {
        const info = await this.slack.conversationsInfo({
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
          const info = await this.slack.getTeamInfo({
            team: id,
          });
          return info.team.name;
        } catch (err) {
          console.log(
            "Error getting team name, probably need to re-connect the account at pipedream.com/apps",
            err,
          );
          return id;
        }
      });
    },
    async getMessage({
      channel, event_ts: ts,
    }) {
      return await this.maybeCached(
        `lastMessage:${channel}:${ts}`,
        async () => {
          const response = await this.slack.getConversationReplies({
            channel,
            ts,
            limit: 1,
          });

          if (response.messages.length) {
            response.messages = [
              response.messages[0],
            ];
          }

          return response;
        },
      );
    },
    processEvent(event) {
      return event;
    },
  },
  async run(event) {
    event = await this.processEvent(event);

    if (event) {
      if (!event.client_msg_id) {
        event.pipedream_msg_id = `pd_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 10)}`;
      }

      this.$emit(event, {
        id: event.client_msg_id || event.pipedream_msg_id || event.channel.id,
        summary: this.getSummary(event),
        ts: event.event_ts || Date.now(),
      });
    }
  },
};
