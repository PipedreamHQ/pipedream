const intercom = require("../../intercom.app.js")

module.exports = {
  key: "intercom-new-unsubscription",
  name: "New Unsubscriptions",
  description:
    "Emits an event each time a user unsubscribes from receiving emails.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    intercom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    const data = {
      query: {
        operator: "AND",
        value: [
          {
            field: "unsubscribed_from_emails",
            operator: "=",
            value: true,
          },
          {
            field: "role",
            operator: "=",
            value: "user",
          },
        ],
      },
    };

    let results = null;
    let starting_after = null;

    while (!results || results.data.pages.next) {
      if (results) starting_after = results.data.pages.next.starting_after;
      results = await this.intercom.searchContacts(data, starting_after);
      for (const user of results.data.data) {
        this.$emit(user, {
          id: user.id,
          summary: user.name,
          ts: Date.now(),
        });
      }
    }
  },
};