import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-contact",
  name: "New Contacts",
  description: "Emit new event for each new contact added.",
  version: "0.1.0",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    properties: {
      propDefinition: [
        common.props.hubspot,
        "contactProperties",
      ],
    },
  },
  methods: {
    ...common.methods,
    getTs(contact) {
      return Date.parse(contact.createdAt);
    },
    generateMeta(contact) {
      const {
        id,
        properties,
      } = contact;
      const ts = this.getTs(contact);
      return {
        id,
        summary: `${properties.firstname} ${properties.lastname}`,
        ts,
      };
    },
    isRelevant(contact, createdAfter) {
      return this.getTs(contact) > createdAfter;
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
        properties: this.properties,
        object: "contacts",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
};
