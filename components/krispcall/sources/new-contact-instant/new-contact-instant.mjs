import krispcall from "../../krispcall.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "krispcall-new-contact-instant",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    krispcall,
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const contacts = await this.krispcall.getContacts();
      for (const contact of contacts.slice(0, 50)) {
        this.$emit(contact, {
          id: contact.id,
          summary: `New Contact: ${contact.name || contact.number}`,
          ts: Date.now(),
        });
      }
    },
    async activate() {
      // No webhook available, so no activation needed
    },
    async deactivate() {
      // No webhook available, so no deactivation needed
    },
  },
  methods: {
    async createContact(opts = {}) {
      const {
        number, name, email, company, address,
      } = opts;
      const response = await this.krispcall.createContact({
        number,
        name,
        email,
        company,
        address,
      });
      this.emitNewContact(response);
      return response;
    },
    emitNewContact(contact) {
      this.$emit(contact, {
        summary: `New Contact Created: ${contact.name || contact.number}`,
        ts: Date.now(),
      });
    },
  },
  async run() {
    const contacts = await this.krispcall.getContacts();
    for (const contact of contacts) {
      this.$emit(contact, {
        id: contact.id,
        summary: `New Contact: ${contact.name || contact.number}`,
        ts: Date.now(),
      });
    }
  },
};
