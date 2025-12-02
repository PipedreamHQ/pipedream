import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "help_scout-new-conversation-assigned-instant",
  name: "New Conversation Assigned (Instant)",
  description: "Emit new event when a conversation is assigned to an agent. [See the documentation](https://developer.helpscout.com/)",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "convo.assigned",
      ];
    },
    getSummary(body) {
      return `New conversation assigned to ${body.assignee.email}`;
    },
  },
  sampleEmit,
};
