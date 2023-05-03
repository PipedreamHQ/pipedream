import common from "../common/base.mjs";

export default {
  ...common,
  key: "exact-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event each time a new contact is created. [See the docs](https://start.exactonline.nl/docs/HlpRestAPIResourcesDetails.aspx?name=CRMContacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResults(division) {
      return this.exact.listContacts(division);
    },
    getCreatedTs(contact) {
      return contact.Created.match(/\d+/)[0];
    },
    generateMeta(contact) {
      return {
        id: contact.ID,
        summary: contact.FullName,
        ts: this.getCreatedTs(contact),
      };
    },
  },
};
