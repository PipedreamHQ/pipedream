const calendly = require("https://github.com/PipedreamHQ/pipedream/components/calendly/calendly.app.js");

module.exports = {
  name: "Invitee Created (Instant)",
  description: "Emits an event when an invitee schedules an event",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    calendly,
    db: "$.service.db",
    http: "$.interface.http",
  },

  hooks: {
    async activate() {
      const body = {
        url: this.http.endpoint,
        events: ['invitee.created']
      };
      const resp = await this.calendly.createHook(body);
      this.db.set("hookId", resp.data.id);
    },
    async deactivate() {
      await this.calendly.deleteHook(this.db.get("hookId"));
    },
  },

  async run(event) {
    this.$emit(event.body, {
      id: event.body.payload.event.uuid,
      summary: event.body.payload.event_type.name,
      ts: Date.now(),
    });
  }
}