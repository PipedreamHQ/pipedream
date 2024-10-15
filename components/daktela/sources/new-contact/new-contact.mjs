import daktela from "../../daktela.app.mjs";

export default {
  key: "daktela-new-contact",
  name: "New Contact Added",
  description: "Emit a new event when a new contact is added to the system. [See the documentation](https://customer.daktela.com/apihelp/v6/global/general-information)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    daktela,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900, // every 15 minutes
      },
    },
  },
  methods: {
    _getLastContactId() {
      return this.db.get("lastContactId") || 0;
    },
    _setLastContactId(id) {
      this.db.set("lastContactId", id);
    },
  },
  hooks: {
    async deploy() {
      const contacts = await this.daktela._makeRequest({
        path: "/contacts",
      });

      contacts.slice(-50).forEach((contact) => {
        this.$emit(contact, {
          id: contact.contact,
          summary: `New contact added: ${contact.firstname} ${contact.lastname}`,
        });
      });

      if (contacts.length > 0) {
        this._setLastContactId(contacts[contacts.length - 1].contact);
      }
    },
  },
  async run() {
    const lastContactId = this._getLastContactId();
    const contacts = await this.daktela._makeRequest({
      path: "/contacts",
    });

    contacts.forEach((contact) => {
      if (contact.contact > lastContactId) {
        this.$emit(contact, {
          id: contact.contact,
          summary: `New contact added: ${contact.firstname} ${contact.lastname}`,
        });
      }
    });

    if (contacts.length > 0) {
      this._setLastContactId(contacts[contacts.length - 1].contact);
    }
  },
};
