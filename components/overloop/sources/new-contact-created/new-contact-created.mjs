import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event each time a contact is created. [See the docs](https://apidoc.overloop.com/#list-contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listContacts, {
        sort: "-created_at",
      });
      results.slice(0, limit).forEach((result) => this.emitEvent(result));
    },
    getResultTs(contact) {
      return Date.parse(contact.attributes.created_at);
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `${contact.attributes.first_name} ${contact.attributes.last_name}`,
        ts: this.getResultTs(contact),
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listContacts, {
      sort: "-created_at",
    });
    results.forEach((result) => this.emitEvent(result));
  },
};
