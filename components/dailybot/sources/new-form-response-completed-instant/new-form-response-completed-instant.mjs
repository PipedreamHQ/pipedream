import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dailybot-new-form-response-completed-instant",
  name: "New Form Response Completed (Instant)",
  description: "Emit new event when a response is added to a form in DailyBot by any user from your organization or an external user.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "forms.response.created",
      ];
    },
    emitEvent(body) {
      const data = body.body;

      this.$emit(body, {
        id: data.uuid,
        summary: "New response completed",
        ts: Date.parse(data.event_timestamp),
      });
    },
  },
  sampleEmit,
};
