import highergov from "../../highergov.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "highergov-new-pursuit-added-instant",
  name: "New Pursuit Added (Instant)",
  description: "Emit new event when a pursuit is added to the pipeline.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    highergov,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      await this.highergov.subscribeWebhook({
        data: {
          target_url: this.http.endpoint,
        },
      });
    },
    async deactivate() {
      await this.highergov.unsubscribeWebhook();
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.opp_key,
      summary: `New pursuit added: ${body.title}`,
      ts: Date.parse(body.current_datetime),
    });
  },
  sampleEmit,
};
