import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "guru-announcement-read-instant",
  name: "New Announcement Read (Instant)",
  description: "Emit new event when a user clicks on the \"I read it\" button in an Announcement. [See the documentation](https://developer.getguru.com/docs/creating-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "alert-read";
    },
    getSummary(body) {
      return `Announcement Read: ${body.id}`;
    },
  },
  sampleEmit,
};
