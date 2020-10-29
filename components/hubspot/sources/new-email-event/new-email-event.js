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
    const params = {
      limit: 100,
      startTimestamp: createdAfter.getTime(),
    };

    let hasMore = true;
    let done = false;

    while (hasMore && !done) {
      let results = await this.hubspot.getEmailEvents(params);
      hasMore = results.hasMore;
      if (hasMore) params.offset = results.offset;
      for (const emailevent of results.events) {
        let createdAt = new Date(emailevent.created);
        if (createdAt.getTime() > createdAfter.getTime()) {
          this.$emit(emailevent, {
            id: emailevent.id,
            summary: `${emailevent.recipient} - ${emailevent.type}`,
            ts: createdAt.getTime(),
          });
        } else {
          done = true;
        }
      }
    }
  },
};