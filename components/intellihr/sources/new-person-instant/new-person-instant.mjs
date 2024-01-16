import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "intellihr-new-person-instant",
  name: "New Person (Instant)",
  description: "Emit new event when a new person is created in intellihr. [See the documentation](https://developers.intellihr.io/docs/v1/#tag/Webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "person.created";
    },
    getSummary(person) {
      return `New Person Created ${person.id}`;
    },
  },
  sampleEmit,
};
