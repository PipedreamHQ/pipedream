import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "invision_community-new-forum-topic-instant",
  name: "New Forum Topic (Instant)",
  description: "Emit new event when a new topic is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "forumsTopic_create",
      ];
    },
    getSummary(body) {
      return `New topic with Id: ${body.id} created successfully!`;
    },
  },
  sampleEmit,
};
