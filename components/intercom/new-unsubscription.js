const intercom = require("https://github.com/PipedreamHQ/pipedream/components/intercom/intercom.app.js");

module.exports = {
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

    while (
      results.data.pages.next !== null &&
      results.data.pages.next !== undefined
    ) {
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