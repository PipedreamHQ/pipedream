import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-contact-updated",
  name: "Contact Updated",
  description: "Emit new event each time a contact is updated.",
  version: "0.0.13",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getTs(contact) {
      return Date.parse(contact.updatedAt);
    },
    generateMeta(contact) {
      const {
        id,
        properties,
      } = contact;
      const ts = this.getTs(contact);
      return {
        id: `${id}${ts}`,
        summary: `${properties.firstname} ${properties.lastname}`,
        ts,
      };
    },
    isRelevant(contact, updatedAfter) {
      return this.getTs(contact) > updatedAfter;
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
