import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-contact-updated",
  name: "Contact Updated",
  description: "Emit new event each time a contact is updated.",
  version: "0.0.8",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    generateMeta(contact) {
      const {
        id,
        properties,
        updatedAt,
      } = contact;
      const ts = Date.parse(updatedAt);
      return {
        id: `${id}${ts}`,
        summary: `${properties.firstname} ${properties.lastname}`,
        ts,
      };
    },
    isRelevant(contact, updatedAfter) {
      return Date.parse(contact.updatedAt) > updatedAfter;
    },
    getParams() {
      return {
        limit: 100,
        sorts: [
          {
            propertyName: "lastmodifieddate",
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
