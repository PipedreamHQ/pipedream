const intercom = require("https://github.com/PipedreamHQ/pipedream/components/intercom/intercom.app.js");

module.exports = {
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

    let results = null;
    let starting_after = null;

    while (
      !results || (
      results.data.pages.next !== null &&
      results.data.pages.next !== undefined
    )) {
      if (results) starting_after = results.data.pages.next.starting_after;
      results = await this.intercom.searchContacts(data, starting_after);
      for (const lead of results.data.data) {
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
    }
  },
};