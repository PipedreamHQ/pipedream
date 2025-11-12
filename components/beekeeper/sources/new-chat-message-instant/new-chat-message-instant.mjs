import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "beekeeper-new-chat-message-instant",
  name: "New Chat Message (Instant)",
  description: "Emit new event instantly when a new chat message is created in any chat the user is a member of. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/1ba495ce70084-register-a-new-webhook)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "CHATS_V2.MESSAGE.CREATED";
    },
    getSummary(body) {
      return `New message in chat ${body.payload.message.id}`;
    },
  },
  sampleEmit,
};
