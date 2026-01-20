import common from "../common/common.mjs";

export default {
  ...common,
  key: "intercom-lead-added-email",
  name: "Lead Added Email",
  description: "Emit new event each time a lead adds their email address.",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta({
      id, email, updated_at: updatedAt,
    }) {
      return {
        id,
        summary: email,
        ts: updatedAt,
      };
    },
  },
  async run() {
    let lastLeadUpdatedAt = this._getLastUpdate();
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

    const results = await this.intercom.searchContacts(data);
    for (const lead of results) {
      if (lead.updated_at > lastLeadUpdatedAt)
        lastLeadUpdatedAt = lead.updated_at;
      const meta = this.generateMeta(lead);
      this.$emit(lead, meta);
    }

    this._setLastUpdate(lastLeadUpdatedAt);
  },
};
