import mailosaur from "../../mailosaur.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mailosaur-new-message",
  name: "New Message Received",
  description: "Emit new event when a message is received in a specified Mailosaur inbox. [See the documentation](https://mailosaur.com/docs/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    mailosaur,
    db: "$.service.db",
    serverId: {
      propDefinition: [
        mailosaur,
        "serverId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    receiveAfter: {
      propDefinition: [
        mailosaur,
        "receiveAfter",
      ],
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const receiveAfter = this.receiveAfter || new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();
      const response = await this.mailosaur.searchMessages({
        serverId: this.serverId,
        receiveAfter,
        itemsPerPage: 50,
      });

      const messages = response.items;
      messages.reverse().slice(0, 50)
        .forEach((message) => {
          this.$emit(message, {
            id: message.id,
            summary: `New Message: ${message.subject}`,
            ts: Date.parse(message.received),
          });
        });

      if (messages.length) {
        this._setLastTimestamp(messages[messages.length - 1].received);
      }
    },
    async activate() {
      // Hook for activating the component
    },
    async deactivate() {
      // Hook for deactivating the component
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp() || new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();

    const response = await this.mailosaur.searchMessages({
      serverId: this.serverId,
      receiveAfter: lastTimestamp,
      itemsPerPage: 50,
    });

    const messages = response.items;
    messages.reverse().forEach((message) => {
      this.$emit(message, {
        id: message.id,
        summary: `New Message: ${message.subject}`,
        ts: Date.parse(message.received),
      });
    });

    if (messages.length) {
      this._setLastTimestamp(messages[messages.length - 1].received);
    }
  },
};
