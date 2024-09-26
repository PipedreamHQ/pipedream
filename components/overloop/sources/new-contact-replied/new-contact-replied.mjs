import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-contact-replied",
  name: "New Contact Replied",
  description: "Emit new event each time a contact replies to an email or LinkedIn message. [See the docs](https://apidoc.overloop.com/#list-contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listContacts, {
        sort: "-updated_at",
        filter: "replied:true",
      });
      results.slice(0, limit).forEach((result) => this.emitEvent(result));
    },
    getResultTs(contact) {
      return Date.parse(contact.attributes.replied_at);
    },
    generateMeta(contact) {
      const ts = this.getResultTs(contact);
      return {
        id: `${contact.id}${ts}`,
        summary: `${contact.attributes.first_name} ${contact.attributes.last_name}`,
        ts,
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listContacts, {
      sort: "-updated_at",
      filter: "replied:true",
    });
    results.forEach((result) => this.emitEvent(result));
  },
};
