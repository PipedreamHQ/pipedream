import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "onelogin-new-login-attempt",
  name: "New Login Attempt",
  description: "Emit new event when a login attempt occurs in OneLogin. Users can optionally filter by successful or failed attempts. [See the documentation](https://developers.onelogin.com/api-docs/1/events/get-events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return 111;
    },
    getSummary(item) {
      return `${item.user_name} attempted to login`;
    },
  },
  sampleEmit,
};
