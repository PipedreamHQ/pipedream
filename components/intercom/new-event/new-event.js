const intercom = require("../../intercom.app.js")

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
        const users = [];
        const data = {
          query: {
            field: "role",
            operator: "=",
            value: "user",
          },
        };
        let results = await this.intercom.searchContacts(data);
        for (const user of results.data.data) users.push(user);
        while (
          results.data.pages.next !== null &&
          results.data.pages.next !== undefined
        ) {
          results = await this.intercom.searchContacts(
            data,
            results.data.pages.next.starting_after
          );
          for (const user of results.data.data) users.push(user);
        }
        return users.map((user) => {
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
      let results = null;
      let next = null;

      while (!results || results.data.pages.next) {
        if (results) next = results.data.pages.next;
        else next = since;
        results = await this.intercom.getEvents(userId, next);
        for (const result of results.data.events) {
          this.$emit(result, {
            id: result.id,
            summary: result.event_name,
            ts: result.created_at,
          });
        }
        // store the latest 'since' url by the userId
        if (results.data.pages.since)
          this.db.set(userId, results.data.pages.since);
      }
    }
  },
};