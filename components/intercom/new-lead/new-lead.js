const intercom = require("../../intercom.app.js")

module.exports = {
  key: "intercom-new-lead",
  name: "New Leads",
  description: "Emits an event each time a new lead is added.",
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
    let lastLeadCreatedAt =
      this.db.get("lastLeadCreatedAt") || Math.floor(monthAgo / 1000);
    const data = {
      query: {
        operator: "AND",
        value: [
          {
            field: "created_at",
            operator: ">",
            value: lastLeadCreatedAt,
          },
          {
            field: "role",
            operator: "=",
            value: "lead",
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
        if (lead.created_at > lastLeadCreatedAt)
          lastLeadCreatedAt = lead.created_at;
        this.$emit(lead, {
          id: lead.id,
          summary: lead.name || lead.id,
          ts: lead.created_at,
        });
      }
    }

    this.db.set("lastLeadCreatedAt", lastLeadCreatedAt);
  },
};