import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "heartbeat-user-updated-instant",
  name: "User Updated (Instant)",
  description: "Emit new event when a user is updated. [See the documentation](https://heartbeat.readme.io/reference/createwebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "USER_UPDATE";
    },
    getSummary(body) {
      return `User Updated: ${body.id}`;
    },
    getFunction() {
      return this.heartbeat.getUser;
    },
    getDate() {
      return Date.now();
    },
  },
  sampleEmit,
};
