import app from "../../siteleaf.app.mjs";

export default {
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "How often to poll the Siteleaf API for new events",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    setEmittedEvents(emittedEvents) {
      this.db.set("emittedEvents", emittedEvents);
    },
    getEmittedEvents() {
      return this.db.get("emittedEvents") || {};
    },
    fetchEvents() {
      throw new Error("fetchEvents() not implemented");
    },
  },
  async run() {
    await this.fetchEvents();
  },
};
