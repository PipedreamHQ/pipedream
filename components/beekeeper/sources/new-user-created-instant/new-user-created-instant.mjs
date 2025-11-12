import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "beekeeper-new-user-created-instant",
  name: "New User Created (Instant)",
  description: "Emit new event when a new user is created. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/1ba495ce70084-register-a-new-webhook)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "USER.CREATED";
    },
    getSummary(body) {
      return `New user created: ${body.payload.user_id}`;
    },
  },
  sampleEmit,
};
