import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "invision_community-new-member-instant",
  name: "New Member (Instant)",
  description: "Emit new event when a new member account is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "member_create",
      ];
    },
    getSummary(body) {
      return `New member with Id: ${body.id} created successfully!`;
    },
  },
  sampleEmit,
};
