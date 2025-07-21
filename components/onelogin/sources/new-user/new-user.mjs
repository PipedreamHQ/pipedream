import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "onelogin-new-user",
  name: "New User Created",
  description: "Emit new event when a user is created in OneLogin. [See the documentation](https://developers.onelogin.com/api-docs/1/events/get-events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return 13;
    },
    getSummary(item) {
      return `New user created with ID: ${item.user_id}`;
    },
  },
  sampleEmit,
};
