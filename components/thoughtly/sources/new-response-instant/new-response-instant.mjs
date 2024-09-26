import thoughtly from "../../thoughtly.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "thoughtly-new-response-instant",
  name: "New Response (Instant)",
  description: "Emit new event when a thoughtly gets a new response.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    thoughtly,
    http: "$.interface.http",
    db: "$.service.db",
    interviewId: {
      propDefinition: [
        thoughtly,
        "interviewId",
      ],
    },
  },
  hooks: {
    async activate() {
      await this.thoughtly.createHook({
        data: {
          type: "NEW_RESPONSE",
          url: this.http.endpoint,
          data: this.interviewId,
        },
      });
    },
    async deactivate() {
      await this.thoughtly.deleteHook({
        data: {
          type: "NEW_RESPONSE",
          url: this.http.endpoint,
          data: this.interviewId,
        },
      });
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.id,
      summary: `New response received with Id: ${body.id}`,
      ts: Date.parse(body.created),
    });
  },
  sampleEmit,
};
