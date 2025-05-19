import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "selzy-new-subscriber-instant",
  name: "New Subscriber (Instant)",
  description: "Emit new event when a new contact subscribes to a specified list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    	...common.props,
    listId: {
      propDefinition: [
        common.props.selzy,
        "listId",
      ],
      description: "Code of the list you want to monitor.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getEventType() {
      return {
        "events[subscribe]": this.listId
          ? this.listId
          : "*",
      };
    },
    getSummary(body) {
      return `New subscriber: ${body.email}`;
    },
  },
  sampleEmit,
};
