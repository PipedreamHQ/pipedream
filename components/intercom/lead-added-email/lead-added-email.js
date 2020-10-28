const intercom = require("../../intercom.app.js")

module.exports = {
  key: "intercom-lead-added-email",
  name: "Lead Added Email",
  description: "Emits an event each time a lead adds their email address.",
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
    let lastLeadUpdatedAt =
      this.db.get("lastLeadUpdatedAt") || Math.floor(monthAgo / 1000);
    const data = {
      query: {
        operator: "AND",
        value: [
          {
            field: "updated_at",
            operator: ">",
            value: lastLeadUpdatedAt,
          },
          {
            field: "role",
            operator: "=",
            value: "lead",
          },
          {
            field: "email",
            operator: "!=",
            value: null,
          },
        ],
      },
    };

    let results = null;
    let starting_after = null;

    while (!results || results.data.pages.next) {
      if (results) starting_after = results.data.pages.next.starting_after;
      results = await this.intercom.searchContacts(data, starting_after);
      for (const lead of results.data.data) {
        if (lead.updated_at > lastLeadUpdatedAt)
          lastLeadUpdatedAt = lead.updated_at;
        this.$emit(lead, {
          id: lead.id,
          summary: lead.email,
          ts: lead.updated_at,
        });
      }
    }

    this.db.set("lastLeadUpdatedAt", lastLeadUpdatedAt);
  },
};