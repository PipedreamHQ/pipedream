import googleChat from "../../google_chat.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    googleChat,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    spaceId: {
      propDefinition: [
        googleChat,
        "spaceId",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    async *paginateMessages(max) {
      const lastTs = this._getLastTs();
      let next, count = 0;
      const params = {
        filter: lastTs
          ? `createTime > "${lastTs}"`
          : undefined,
        orderBy: "createTime DESC",
      };

      do {
        const {
          messages, nextPageToken,
        } = await this.googleChat.listMessages({
          spaceId: this.spaceId,
          params,
        });

        if (!messages.length) {
          return;
        }

        for (const message of messages) {
          yield message;
          if (max && ++count >= max) {
            return;
          }
        }

        next = nextPageToken;
        params.pageToken = next;
      } while (next);
    },
    async getPaginatedMessages(max) {
      const messages = [];
      for await (const message of this.paginateMessages(max)) {
        messages.push(message);
      }
      return messages;
    },
    isRelevant() {
      return true;
    },
    generateMeta(message) {
      return {
        id: message.name,
        summary: this.getSummary(message),
        ts: Date.parse(message.createTime),
      };
    },
    async processEvent(max) {
      const messages = await this.getPaginatedMessages(max);

      const relevantMessages = messages.filter((message) => this.isRelevant(message));

      if (!relevantMessages?.length) {
        return;
      }

      this._setLastTs(relevantMessages[0].createTime);

      relevantMessages.reverse().forEach((message) => {
        const meta = this.generateMeta(message);
        this.$emit(message, meta);
      });
    },
    getSummary() {
      throw new ConfigurationError("getSummary is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
