import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "heartbeat-new-event-instant",
  name: "New Event (Instant)",
  description: "Emit new event when a new event is created. [See the documentation](https://heartbeat.readme.io/reference/createwebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "EVENT_CREATE";
    },
    getSummary(body) {
      return `New Event: ${body.id}`;
    },
    getFunction() {
      return this.heartbeat.getEvent;
    },
    getDate(body) {
      return body.createdAt;
    },
  },
  sampleEmit,
};
