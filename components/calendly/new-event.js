const calendly = require("https://github.com/PipedreamHQ/pipedream/components/calendly/calendly.app.js");

module.exports = {
  name: "New Event",
  description: "Emits an event for each new event created",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    calendly,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let lastEvent = this.db.get("lastEvent") || this.calendly.monthAgo();
    lastEvent = new Date(lastEvent);

    const events = await this.calendly.getEvents();
    for (const event of events) {
      let created_at = new Date(event.attributes.created_at);
      let start_time = new Date(event.attributes.start_time);
      if (created_at.getTime() > lastEvent) {
        this.$emit(event, {
          id: event.id,
          summary: `New Event at ${start_time.toLocaleString()}`,
          ts: created_at.getTime(),
        });
      }
    }

    this.db.set("lastEvent", Date.now());
  }
};