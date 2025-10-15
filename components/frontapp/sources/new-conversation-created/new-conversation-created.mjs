import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frontapp-new-conversation-created",
  name: "New Conversation Created",
  description: "Emit new event when a conversation is created. [See the documentation](https://dev.frontapp.com/reference/list-conversations)",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getFunction() {
      return this.frontapp.listConversations;
    },
    _getParams() {
      return {
        sort_by: "date",
        sort_order: "desc",
      };
    },
    _getEmit(conversation) {
      return {
        id: conversation.id,
        summary: `New conversation: ${conversation.subject}`,
        ts: conversation.created_at * 1000,
      };
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25, (item, lastTs) => this._getItemTs(item) > lastTs);
    },
  },
  async run() {
    await this.startEvent(0, (item, lastTs) => this._getItemTs(item) > lastTs);
  },
  sampleEmit,
};
