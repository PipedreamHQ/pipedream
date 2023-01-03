import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-contact",
  name: "New Contacts",
  description: "Emit new event for each new contact added.",
  version: "0.0.10",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    generateMeta(contact) {
      const {
        id,
        properties,
        createdAt,
      } = contact;
      const ts = Date.parse(createdAt);
      return {
        id,
        summary: `${properties.firstname} ${properties.lastname}`,
        ts,
      };
    },
    isRelevant(contact, createdAfter) {
      return Date.parse(contact.createdAt) > createdAfter;
    },
    getParams() {
      return {
        limit: 100,
        sorts: [
          {
            propertyName: "createdate",
            direction: "DESCENDING",
          },
        ],
        properties: this._getProperties(),
        object: "contacts",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
};
