import common from "./base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  hooks: {
    ...common.hooks,
    async deploy() {
      const historyId = await this.getHistoryId();
      if (!historyId) {
        return;
      }
      this._setLastHistoryId(historyId);
      await this.emitRecentMessages();
    },
  },
  methods: {
    ...common.methods,
    _getLastHistoryId() {
      return this.db.get("lastHistoryId");
    },
    _setLastHistoryId(lastHistoryId) {
      this.db.set("lastHistoryId", lastHistoryId);
    },
    async getHistoryId() {
      const params = {
        maxResults: constants.HISTORICAL_EVENTS,
      };

      let allMessages = [];

      if (this.labels?.length) {
        // Make individual calls for each labelId to make it inclusive (OR logic)
        for (const labelId of this.labels) {
          const { messages } = await this.gmail.listMessages({
            ...params,
            labelIds: [
              labelId,
            ],
          });
          if (messages?.length) {
            allMessages.push(...messages);
          }
        }
      } else {
        // No labels specified, get all messages
        const { messages } = await this.gmail.listMessages(params);
        if (messages?.length) {
          allMessages.push(...messages);
        }
      }

      if (!allMessages.length) {
        const { historyId } = await this.gmail.getProfile();
        return historyId;
      }

      // Remove duplicates based on message id
      const uniqueMessages = allMessages.filter((message, index, self) =>
        index === self.findIndex((m) => m.id === message.id));

      const messageIds = uniqueMessages.map(({ id }) => id);
      const messages = [];
      for await (const message of this.gmail.getAllMessages(messageIds)) {
        messages.push(message);
      }

      const sortedMessages =
        Array.from(messages)
          .sort((a, b) => (Number(b.historyId) - Number(a.historyId)));

      const { historyId } = await this.gmail.getMessage({
        id: sortedMessages[0].id,
      });
      return historyId;
    },
    async emitHistories(startHistoryId) {
      const opts = {
        startHistoryId: String(startHistoryId),
        historyTypes: this.getHistoryTypes(),
        maxResults: constants.MAX_LIMIT,
      };

      const length = this.labels?.length > 0
        ? this.labels.length
        : 1;
      let maxHistoryId = 0;

      for (let i = 0; i < length; i++) {
        if (this.labels) {
          opts.labelId = this.labels[i];
        }

        try {
          const {
            history, historyId,
          } = await this.gmail.listHistory(opts);

          maxHistoryId = Math.max(maxHistoryId, historyId);

          if (!history) {
            continue;
          }

          const responseArray = this.filterHistory(history);

          for (const item of responseArray) {
            await this.emitFullMessage(item.messages[0].id);
          }
        } catch (error) {
          // Handle expired or invalid historyId (HTTP 404)
          if (error.status === 404 || error.message.includes("Requested entity was not found")) {
            console.log(`History request failed with expired historyId: ${error.message}`);
            console.log("Getting fresh historyId from profile");

            // Get fresh historyId from profile
            const profile = await this.gmail.getProfile();
            const freshHistoryId = profile.historyId;

            if (freshHistoryId) {
              this._setLastHistoryId(freshHistoryId);
            }

            // Skip processing for this run since we're resetting the historyId
            return;
          } else {
            // Re-throw other errors
            throw error;
          }
        }
      }
      if (maxHistoryId > 0) {
        this._setLastHistoryId(maxHistoryId);
      }
    },
    async emitRecentMessages() {
      const opts = {
        maxResults: constants.HISTORICAL_EVENTS,
      };

      let allMessages = [];

      if (this.labels?.length) {
        // Make individual calls for each labelId to make it inclusive (OR logic)
        for (const labelId of this.labels) {
          const { messages } = await this.gmail.listMessages({
            ...opts,
            labelIds: [
              labelId,
            ],
          });
          if (messages?.length) {
            allMessages.push(...messages);
          }
        }
      } else {
        // No labels specified, get all messages
        const { messages } = await this.gmail.listMessages(opts);
        if (messages?.length) {
          allMessages.push(...messages);
        }
      }

      if (!allMessages.length) {
        return;
      }

      // Remove duplicates based on message id
      const uniqueMessages = allMessages.filter((message, index, self) =>
        index === self.findIndex((m) => m.id === message.id));

      const sortedMessages = uniqueMessages.sort((a, b) => (a.internalDate - b.internalDate));
      for (const message of sortedMessages) {
        await this.emitFullMessage(message.id);
      }
    },
    async emitFullMessage(id) {
      let message;
      try {
        message = await this.gmail.getMessage({
          id,
        });
        if (this.excludeLabels && message.labelIds.some((i) => this.excludeLabels.includes(i))) {
          return;
        }
      } catch (error) {
        console.log(`Message ${id} not found: ${error.message}`);
        return;
      }
      await this.emitEvent(message);
    },
  },
  async run() {
    let lastHistoryId = this._getLastHistoryId();

    if (!lastHistoryId) {
      lastHistoryId = await this.getHistoryId();
    }
    await this.emitHistories(lastHistoryId);
  },
};
