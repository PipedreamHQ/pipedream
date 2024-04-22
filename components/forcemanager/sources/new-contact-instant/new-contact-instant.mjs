import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-new-contact-instant",
  name: "New Contact Instant",
  description: "Emit an event when a new contact is created in ForceManager",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    forcemanager,
    contactId: {
      propDefinition: [
        forcemanager,
        "contactId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getContact() {
      return this.forcemanager.searchContact("id", this.contactId);
    },
    _isContactNew(contact) {
      const lastContactId = this.db.get("lastContactId");
      return contact.id !== lastContactId;
    },
    _storeContactId(contactId) {
      this.db.set("lastContactId", contactId);
    },
  },
  async run() {
    const contact = await this._getContact();
    if (this._isContactNew(contact)) {
      this.$emit(contact, {
        id: contact.id,
        summary: `New Contact: ${contact.name}`,
        ts: Date.now(),
      });
      this._storeContactId(contact.id);
    }
  },
};
