import common from "./base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  hooks: {
    ...common.hooks,
    async deploy() {
      if (this.triggerType === "webhook") {
        return;
      }
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
      if (this.label) {
        params.labelIds = this.label;
      }
      let { messages } = await this.gmail.listMessages({
        params,
      });
      if (!messages?.length) {
        return;
      }
      const messageIds = messages.map(({ id }) => id);
      messages = await this.gmail.getMessages(messageIds);
      messages = messages.sort((a, b) => (a.internalDate - b.internalDate));
      const { historyId } = await this.gmail.getMessage({
        id: messages[messages.length - 1].id,
      });
      return historyId;
    },
    async emitHistories(startHistoryId) {
      const opts = {
        startHistoryId,
        historyTypes: this.getHistoryTypes(),
      };
      if (this.label) {
        opts.labelId = this.label;
      }

      const {
        history, historyId,
      } = await this.gmail.listHistory(opts);

      if (!history) {
        return;
      }
      this._setLastHistoryId(historyId);

      const responseArray = this.filterHistory(history);
      for (const item of responseArray) {
        await this.emitFullMessage(item.messages[0].id);
      }
    },
    async emitRecentMessages() {
      const opts = {
        maxResults: constants.HISTORICAL_EVENTS,
      };
      if (this.label) {
        opts.labelIds = this.label;
      }
      let { messages } = await this.gmail.listMessages(opts);
      if (!messages?.length) {
        return;
      }
      messages = messages.sort((a, b) => (a.internalDate - b.internalDate));
      for (const message of messages) {
        await this.emitFullMessage(message.id);
      }
    },
    async emitFullMessage(id) {
      let message;
      try {
        message = await this.gmail.getMessage({
          id,
        });
      } catch {
        console.log(`Message ${id} not found`);
      }
      this.emitEvent(message);
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
