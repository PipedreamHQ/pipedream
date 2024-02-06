import common from "../common/base.mjs";

export default {
  ...common,
  key: "listmonk-new-subscriber-added",
  name: "New Subscriber Added",
  description: "Emit new event when a new subscriber is added. [See the documentation](https://listmonk.app/docs/apis/subscribers/#get-apisubscribers_2)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.listmonk.listSubscribers;
    },
    generateMeta(subscriber) {
      return {
        id: subscriber.id,
        summary: `New Subscriber ${subscriber.name}`,
        ts: Date.parse(subscriber.created_at),
      };
    },
  },
};
