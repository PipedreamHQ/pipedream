import gorgias from "../../gorgias.app.mjs";

export default {
  key: "gorgias-new-events",
  name: "New Events",
  description: "Emit new Gorgias event",
  version: "0.1.0",
  type: "source",
  dedupe: "greatest",
  props: {
    gorgias,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  async run() {
    const events = await this.gorgias.getEvents();
    events.forEach((event) => {
      this.$emit(event, {
        id: event.id,
        ts: Date.parse(event.created_datetime),
        summary: event.type,
      });
    });
  },
};
