import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dailybot-kudos-given-instant",
  name: "New Kudos Given (Instant)",
  description: "Emit new event every time any kudos are given to someone in your DailyBot organization.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "kudos.posted",
      ];
    },
    emitEvent(body) {
      const data = body.body;
      const receivers = data.receivers.map((receiver) => receiver.full_name);

      this.$emit(body, {
        id: data.uuid,
        summary: `New kudos from ${data.giver.full_name} to ${receivers.join(",")}`,
        ts: Date.parse(data.event_timestamp),
      });
    },
  },
  sampleEmit,
};
