import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import gmail from "../../gmail_custom_oauth.app.mjs";

export default {
  gmail,
  key: "gmail_custom_oauth-new-labeled-email",
  name: "New Labeled Email",
  description: "Emit new event when a new email is labeled.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    gmail,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Monday API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    label: {
      propDefinition: [
        gmail,
        "label",
      ],
    },
  },
  methods: {
    ...gmail.methods,
    getMessage({
      messageId, ...opts
    }) {
      return this.gmail._makeRequest({
        path: `messages/${messageId}`,
        ...opts,
      });
    },
    listMessages(opts = {}) {
      return this.gmail._makeRequest({
        path: "messages",
        ...opts,
      });
    },
    listHistories(opts = {}) {
      return this.gmail._makeRequest({
        path: "history",
        ...opts,
      });
    },
    _getLastHistoryId() {
      return this.db.get("lastHistoryId");
    },
    _setLastHistoryId(lastHistoryId) {
      this.db.set("lastHistoryId", lastHistoryId);
    },
    generateMeta({
      id, messages,
    }) {
      return {
        id: id,
        summary: `A new message with ID: ${messages[0].id} was labeled with "${this.label}"`,
        ts: Date.now(),
      };
    },
    async getHistoryId() {
      const { messages } = await this.listMessages({
        params: {
          labelIds: this.label,
        },
      });
      if (messages.length > 25) messages.length = 25;
      const { id } = messages[messages.length - 1];
      const { historyId } = await this.getMessage({
        messageId: id,
      });
      return historyId;
    },
    async emitHistories(startHistoryId) {
      const {
        history, historyId,
      } = await this.listHistories({
        params: {
          startHistoryId,
          historyTypes: "labelAdded",
          labelId: this.label,
        },
      });

      if (!history) {
         return;
      }
      this._setLastHistoryId(historyId);
      const responseArray = history.filter((item) => item.labelsAdded);
      responseArray.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      const historyId = await this.getHistoryId();
      await this.emitHistories(historyId);
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
