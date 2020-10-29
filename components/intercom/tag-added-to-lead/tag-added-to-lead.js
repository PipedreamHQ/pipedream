const intercom = require("../../intercom.app.js");

module.exports = {
  key: "intercom-tag-added-to-lead",
  name: "Tag Added To Lead",
  description: "Emits an event each time a new tag is added to a lead.",
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
        value: "lead",
      },
    };

    const results = await this.intercom.searchContacts(data);
    for (const lead of results) {
      if (lead.tags.data.length > 0) {
        for (const tag of lead.tags.data) {
          this.$emit(tag, {
            id: `${lead.id}${tag.id}`,
            summary: `Tag added to ${lead.name ? lead.name : lead.id}`,
            ts: Date.now(),
          });
        }
      }
    }
  },
};