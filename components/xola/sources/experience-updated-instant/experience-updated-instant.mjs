import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-experience-updated-instant",
  name: "Experience Updated (Instant)",
  description: "Emit new event when an experience is updated. [See the documentation](https://developers.xola.com/reference/webhook-introduction)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "experience.update";
    },
    generateMeta(body) {
      const { data } = body;
      const ts = Date.now();
      return {
        id: `${data.id}-${ts}`,
        summary: `Experience Updated ${data.name}`,
        ts,
      };
    },
  },
  sampleEmit,
};
