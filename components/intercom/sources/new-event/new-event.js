const intercom = require("../../intercom.app.js");

module.exports = {
  key: "intercom-new-event",
  name: "New Event",
  description: "Emits an event for each new Intercom event for a user.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    intercom,
    userIds: {
      type: "string[]",
      label: "Users",
      async options(opts) {
        const data = {
          query: {
            field: "role",
            operator: "=",
            value: "user",
          },
        };
        const results = await this.intercom.searchContacts(data);
        return results.map((user) => {
          return { label: user.name || user.id, value: user.id };
        });
      },
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    for (const userId of this.userIds) {
      let since = this.db.get(userId) || null;
      const results = await this.intercom.getEvents(userId, since);
      for (const result of results.events) {
        this.$emit(result, {
          id: result.id,
          summary: result.event_name,
          ts: result.created_at,
        });
      }
      // store the latest 'since' url by the userId
      if (results.since) this.db.set(userId, results.since);
    }
  },
};