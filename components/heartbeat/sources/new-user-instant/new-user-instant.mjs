import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "heartbeat-new-user-instant",
  name: "New User (Instant)",
  description: "Emit new event when a new user is created. [See the documentation](https://heartbeat.readme.io/reference/createwebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "USER_JOIN";
    },
    getSummary(body) {
      return `New User Created: ${body.id}`;
    },
    getFunction() {
      return this.heartbeat.getUser;
    },
    getDate(body) {
      return body.createdAt;
    },
  },
  sampleEmit,
};
