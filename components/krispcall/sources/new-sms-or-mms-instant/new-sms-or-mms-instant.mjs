import { axios } from "@pipedream/platform";
import krispcall from "../../krispcall.app.mjs";

export default {
  key: "krispcall-new-sms-or-mms-instant",
  name: "New SMS or MMS Sent",
  description: "Emit new event when a new SMS or MMS is sent. [See the documentation](https://documenter.getpostman.com/view/32476792/2sa3dxfcal)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    krispcall,
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const recentMessages = await this.krispcall.getRecentMessages();
      for (const message of recentMessages.slice(0, 50)) {
        this.$emit(message, {
          id: message.id,
          summary: `New Message: ${message.content}`,
          ts: Date.parse(message.timestamp),
        });
      }
    },
    async activate() {
      // Code to run when the source is activated
    },
    async deactivate() {
      // Code to run when the source is deactivated
    },
  },
  methods: {
    async getRecentMessages() {
      return this.krispcall._makeRequest({
        path: "/messages/recent",
      });
    },
  },
  async run() {
    const recentMessages = await this.getRecentMessages();
    for (const message of recentMessages) {
      this.$emit(message, {
        id: message.id,
        summary: `New Message: ${message.content}`,
        ts: Date.parse(message.timestamp),
      });
    }
  },
};
