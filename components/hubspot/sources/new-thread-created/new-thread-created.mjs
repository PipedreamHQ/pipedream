import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-thread-created",
  name: "New Thread Created",
  description: "Emit new event when a new thread is created. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-thread/get-conversations-v3-conversations-threads)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvent(max) {
      const after = this._getAfter();
      let {
        paging, results,
      } = await this.hubspot.listThreads({
        params: {
          after,
          sort: "-id",
        },
      });
      if (!results?.length) {
        return;
      }
      this._setAfter(paging?.next?.after);
      if (max && results.length > max) {
        results.length = max;
      }
      for (const thread of results) {
        this.emitEvent(thread);
      }
    },
    generateMeta(thread) {
      return {
        id: thread.id,
        summary: `New Thread: ${thread.id}`,
        ts: Date.parse(thread.createdAt),
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
