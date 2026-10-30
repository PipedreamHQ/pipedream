import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-meeting-booked",
  name: "Meeting Booked",
  description: "Emit new event when a visitor books a meeting in a conversation, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "meeting.booked";
    },
    getPath() {
      return "/meetings";
    },
    getIdKey() {
      return "meetingId";
    },
    getSummary() {
      return "Meeting Booked";
    },
  },
};
