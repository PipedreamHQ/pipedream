import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dailybot-new-check-in-response-completed-instant",
  name: "New Check-In Response Completed (Instant)",
  description: "Emit new event when a user from your organization completes a response to a check-in in DailyBot.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "followups.response.completed",
      ];
    },
    emitEvent(body) {
      const data = body.body;

      this.$emit(body, {
        id: data.uuid,
        summary: `Check-in response completed by ${data.user.full_name}`,
        ts: Date.parse(data.event_timestamp),
      });
    },
  },
  sampleEmit,
};
