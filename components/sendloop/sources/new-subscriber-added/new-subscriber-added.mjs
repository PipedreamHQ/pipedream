import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sendloop-new-subscriber-added",
  name: "New Subscriber Added",
  description: "Emit new event when a new subscriber is added to the list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.sendloop,
        "listId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.sendloop.listSubscribers;
    },
    getResourceType() {
      return "Subscribers";
    },
    getData() {
      return {
        ListID: this.listId,
      };
    },
    generateMeta(subscriber) {
      return {
        id: subscriber.SubscriberID,
        summary: `New Subscriber: ${subscriber.EmailAddress}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
