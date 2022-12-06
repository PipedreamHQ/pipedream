import common from "../common/base.mjs";

export default {
  ...common,
  key: "esputnik-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is added",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(contact) {
      return this.generateContactMeta(contact);
    },
  },
  async run() {
    const contacts = await this.getPaginatedContacts(this.esputnik.listContacts.bind(this));
    for await (const contact of contacts) {
      const meta = this.generateMeta(contact);
      this.$emit(contact, meta);
    }
  },
};
