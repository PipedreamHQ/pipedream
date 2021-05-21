const intercom = require("../../intercom.app.js");

module.exports = {
  key: "intercom-new-user",
  name: "New Users",
  description: "Emits an event each time a new user is added.",
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

    const results = await this.intercom.searchContacts(data);
    for (const user of results) {
      if (user.created_at > lastUserCreatedAt)
        lastUserCreatedAt = user.created_at;
      this.$emit(user, {
        id: user.id,
        summary: user.name,
        ts: user.created_at,
      });
    }

    this.db.set("lastUserCreatedAt", lastUserCreatedAt);
  },
};