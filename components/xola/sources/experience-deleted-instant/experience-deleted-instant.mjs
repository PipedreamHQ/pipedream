import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-experience-deleted-instant",
  name: "Experience Deleted (Instant)",
  description: "Emit new event when an experience is deleted. [See the documentation](https://developers.xola.com/reference/webhook-introduction)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "experience.delete";
    },
    generateMeta(body) {
      const { data } = body;
      return {
        id: `${data.id}-deleted-${Date.now()}`,
        summary: `Experience Deleted: ${data.name || data.id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
