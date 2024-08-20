import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";
import base from "../common/polling.mjs";
import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-new-labeled-email",
  name: "New Labeled Email",
  description: "Emit new event when a new email is labeled.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    gmail,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Gmail API on this schedule",
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
    ...base.methods,
    _getLastHistoryId() {
      return this.db.get("lastHistoryId");
    },
    _setLastHistoryId(lastHistoryId) {
      this.db.set("lastHistoryId", lastHistoryId);
    },
    generateMeta(message) {
      return {
        id: `${message.id}-${this.label}`,
        summary: `A new message with ID: ${message.id} was labeled with "${this.label}"`,
        ts: Date.now(),
      };
    },
    async getHistoryId() {
      const { messages } = await this.gmail.listMessages({
        params: {
          labelIds: this.label,
          maxResults: constants.HISTORICAL_EVENTS,
        },
      });
      if (!messages?.length) {
        return;
      }
      const { historyId } = await this.gmail.getMessage({
        id: messages[messages.length - 1].id,
      });
      return historyId;
    },
    async emitHistories(startHistoryId) {
      const {
        history, historyId,
      } = await this.gmail.listHistory({
        startHistoryId,
        historyTypes: [
          "labelAdded",
          "messageAdded",
        ],
        labelId: this.label,
      });

      if (!history) {
        return;
      }
      this._setLastHistoryId(historyId);
      const responseArray = history.filter((item) =>
        (item.labelsAdded && item.labelsAdded[0].labelIds.includes(this.label))
        || (item.messagesAdded && item.messagesAdded[0].message.labelIds.includes(this.label)));
      for (const item of responseArray) {
        await this.emitFullMessage(item.messages[0].id);
      }
      return responseArray.length;
    },
    async emitRecentMessages() {
      const { messages } = await this.gmail.listMessages({
        labelIds: this.label,
        maxResults: constants.HISTORICAL_EVENTS,
      });
      if (!messages?.length) {
        return;
      }
      for (const message of messages) {
        await this.emitFullMessage(message.id);
      }
    },
    async emitFullMessage(id) {
      const message = await this.gmail.getMessage({
        id,
      });
      const meta = this.generateMeta(message);
      this.$emit(this.decodeContent(message), meta);
    },
  },
  hooks: {
    async deploy() {
      const historyId = await this.getHistoryId();
      if (!historyId) {
        return;
      }
      const emittedEventsCount = await this.emitHistories(historyId);
      if (!emittedEventsCount) {
        await this.emitRecentMessages();
      }
    },
  },
  async run() {
    let lastHistoryId = this._getLastHistoryId();

    if (!lastHistoryId) {
      lastHistoryId = await this.getHistoryId();
    }
    await this.emitHistories(lastHistoryId);
  },
  sampleEmit,
};
