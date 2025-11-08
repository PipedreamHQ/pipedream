import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-new-experience-created-instant",
  name: "New Experience Created (Instant)",
  description: "Emit new event when a new experience is created. [See the documentation](https://developers.xola.com/reference/webhook-introduction)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "experience.create";
    },
    generateMeta(body) {
      const { data } = body;
      return {
        id: data.id,
        summary: `New Experience ${data.name}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
