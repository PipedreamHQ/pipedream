import common from "../common/common.mjs";

export default {
  name: "New Subscriber unsubscribed event",
  key: "emailoctopus-subscriber-unsubscribed",
  description: "Emit new event when a subscriber unsubscribed.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.app,
        "listId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getUnsubscribers;
    },
    getResourceFnParams() {
      return {
        listId: this.listId,
      };
    },
    getComparisonType() {
      return "include";
    },
    async getItem(item) {
      return this.app.getContact({
        listId: this.listId,
        contactId: item.id,
      });
    },
    getMeta(item) {
      return {
        id: new Date().getTime(),
        summary: `Subscriber unsubscribed - ${item.email_address}`,
        ts: new Date().getTime(),
      };
    },
  },
};
