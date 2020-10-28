const calendly = require("../../calendly.app.js");

module.exports = {
  key: "calendly-invitee-cancelled",
  name: "Invitee Cancelled (Instant)",
  description: "Emits an event when an invitee cancels a scheduled event",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    calendly,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    }
  },

  hooks: {
    async activate() {
      const body = {
        url: this.http.endpoint,
        events: ['invitee.canceled']
      };
      const resp = await this.calendly.createHook(body);
      this.db.set("hookId", resp.data.id);
    },
    async deactivate() {
      await this.calendly.deleteHook(this.db.get("hookId"));
    },
  },

  async run(event) {
    if (event.headers["x-calendly-hook-id"] != this.db.get("hookId")) {
      return this.http.respond({status: 404});
    }

    this.http.respond({status: 200});
    
    this.$emit(event.body, {
      id: event.body.payload.event.uuid,
      summary: event.body.payload.event_type.name,
      ts: Date.now(),
    });
  }
}