const intercom = require("../../intercom.app.js");

module.exports = {
  key: "intercom-tag-added-to-user",
  name: "Tag Added To User",
  description: "Emits an event each time a new tag is added to a user.",
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
        field: "role",
        operator: "=",
        value: "user",
      },
    };

    const results = await this.intercom.searchContacts(data);
    for (const user of results) {
      if (user.tags.data.length > 0) {
        for (const tag of user.tags.data) {
          this.$emit(tag, {
            id: `${user.id}${tag.id}`,
            summary: `Tag added to ${user.name}`,
            ts: Date.now(),
          });
        }
      }
    }
  },
};