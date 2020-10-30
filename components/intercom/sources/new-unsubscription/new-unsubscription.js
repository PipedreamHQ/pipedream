const intercom = require("../../intercom.app.js");

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

    const results = await this.intercom.searchContacts(data);
    for (const user of results) {
      this.$emit(user, {
        id: user.id,
        summary: user.name,
        ts: Date.now(),
      });
    }
  },
};