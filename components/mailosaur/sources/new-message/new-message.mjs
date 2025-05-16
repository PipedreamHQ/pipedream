import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "mailosaur-new-message",
  name: "New Message Received",
  description: "Emit new event when a message is received in a specified Mailosaur inbox. [See the documentation](https://mailosaur.com/docs/api#list-all-messages)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.mailosaur.listMessages;
    },
    getSummary(item) {
      return `New Message: ${item.subject}`;
    },
  },
  sampleEmit,
};
