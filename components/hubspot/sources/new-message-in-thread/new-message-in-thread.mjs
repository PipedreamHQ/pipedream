import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-message-in-thread",
  name: "New Message in Thread",
  description: "Emit new event when a new message is added to a thread. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-message/get-conversations-v3-conversations-threads-threadId-messages)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    threadId: {
      propDefinition: [
        common.props.hubspot,
        "threadId",
      ],
    },
  },
  methods: {
    ...common.methods,
    async processEvent(max) {
      const after = this._getAfter();
      let {
        paging, results,
      } = await this.hubspot.listMessages({
        threadId: this.threadId,
        params: {
          after,
          sort: "-createdAt",
        },
      });
      if (!results?.length) {
        return;
      }
      this._setAfter(paging?.next?.after);
      if (max && results.length > max) {
        results.length = max;
      }
      for (const message of results) {
        this.emitEvent(message);
      }
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New Message: ${message.id}`,
        ts: Date.parse(message.createdAt),
      };
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
