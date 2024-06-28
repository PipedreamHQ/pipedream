import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "invision_community-new-topic-post-instant",
  name: "New Topic Post (Instant)",
  description: "Emit new event when a new post in a topic is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "forumsTopicPost_create",
      ];
    },
    getSummary(body) {
      return `New post with Id: ${body.id} created successfully!`;
    },
  },
  sampleEmit,
};
