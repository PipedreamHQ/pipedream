import common from "../common/base.mjs";

export default {
  ...common,
  key: "campaign_monitor-new-subscriber",
  name: "New Subscriber Added",
  description: "Emit new event when a new subscriber is added to a specific list",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.campaignMonitor,
        "listId",
        (c) => ({
          clientId: c.clientId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.campaignMonitor.listSubscribers;
    },
    getArgs() {
      return {
        listId: this.listId,
        params: {
          orderfield: "date",
          orderdirection: "desc",
        },
      };
    },
    generateMeta(subscriber) {
      return {
        id: subscriber.EmailAddress,
        summary: `New Subscriber: ${subscriber.EmailAddress}`,
        ts: Date.parse(subscriber[this.getTsField()]),
      };
    },
  },
};
