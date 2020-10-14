const calendly = require("https://github.com/PipedreamHQ/pipedream/components/calendly/calendly.app.js");

module.exports = {
  name: "New Event Type",
  description: "Emits an event for each new event type",
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

    const eventTypes = await this.calendly.getEventTypes();
    for (const eventType of eventTypes) {
      let created_at = new Date(eventType.attributes.created_at);
      if (created_at.getTime() > lastEvent) {
        this.$emit(eventType, {
          id: eventType.id,
          summary: eventType.attributes.name,
          ts: Date.now(),
        });
      }
    }

    this.db.set("lastEvent", Date.now());
  },
};
