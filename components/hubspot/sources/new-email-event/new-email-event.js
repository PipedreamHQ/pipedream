const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-new-email-event",
  name: "New Email Event",
  description: "Emits an event for each new Hubspot email event.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    hubspot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    const createdAfter = new Date(this.hubspot.monthAgo());

    const results = await this.hubspot.getEmailEvents(createdAfter.getTime());
    for (const emailEvent of results) {
      let createdAt = new Date(emailEvent.created);
      this.$emit(emailEvent, {
        id: emailEvent.id,
        summary: `${emailEvent.recipient} - ${emailEvent.type}`,
        ts: createdAt.getTime(),
      });
    }
  },
};