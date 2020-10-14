const intercom = require("https://github.com/PipedreamHQ/pipedream/components/intercom/intercom.app.js");

module.exports = {
  name: "Lead Converted To User",
  description: "Emits an event each time a lead is converted to a user.",
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
    const monthAgo = this.intercom.monthAgo();
    let lastUserCreatedAt =
      this.db.get("lastUserCreatedAt") || Math.floor(monthAgo / 1000);
    const data = {
      query: {
        operator: "AND",
        value: [
          {
            field: "created_at",
            operator: ">",
            value: lastUserCreatedAt,
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
      !results ||
      (results.data.pages.next !== null &&
        results.data.pages.next !== undefined)
    ) {
      if (results) starting_after = results.data.pages.next.starting_after;
      results = await this.intercom.searchContacts(data, starting_after);
      for (const user of results.data.data) {
        if (user.created_at > lastUserCreatedAt)
          lastUserCreatedAt = user.created_at;
        this.$emit(user, {
          id: user.id,
          summary: user.name,
          ts: user.created_at,
        });
      }
    }

    this.db.set("lastUserCreatedAt", lastUserCreatedAt);
  },
};