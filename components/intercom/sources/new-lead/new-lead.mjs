import common from "../common.mjs";

export default {
  ...common,
  key: "intercom-new-lead",
  name: "New Leads",
  description: "Emit new event each time a new lead is added.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta({
      id, name, created_at: createdAt,
    }) {
      return {
        id,
        summary: name || id,
        ts: createdAt,
      };
    },
  },
  async run() {
    let lastLeadCreatedAt = this._getLastUpdate();
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

    const results = await this.intercom.searchContacts(data);
    for (const lead of results) {
      if (lead.created_at > lastLeadCreatedAt)
        lastLeadCreatedAt = lead.created_at;
      const meta = this.generateMeta(lead);
      this.$emit(lead, meta);
    }

    this._setLastUpdate(lastLeadCreatedAt);
  },
};
