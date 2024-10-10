import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "vida-new-incoming-conversation-instant",
  name: "New Incoming Conversation (Instant)",
  description: "Emit new event when an incoming call or message is received before answered by an agent. Useful for providing context about the caller or messenger to your agent before response.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(event) {
      return `New incoming ${event.body.communicationSource} from ${event.body.source}`;
    },
    filterEvents(body) {
      return body.direction === "inbound";
    },
  },
  sampleEmit,
};
