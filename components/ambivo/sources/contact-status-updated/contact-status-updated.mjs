import ambivo from "../../ambivo.app.mjs";

export default {
  key: "ambivo-contact-status-updated",
  name: "Contact Status Updated",
  description: "Emits a new event when a contact's status has been updated. [See the documentation](https://fapi.ambivo.com/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ambivo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    contactId: {
      propDefinition: [
        ambivo,
        "contactId",
      ],
    },
  },
  methods: {
    _getContactId() {
      return this.db.get("contactId");
    },
    _setContactId(id) {
      this.db.set("contactId", id);
    },
    generateMeta(data) {
      const id = data.id;
      const summary = `Contact ${data.id} status updated`;
      const ts = Date.now();
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const contactId = this._getContactId();
    if (contactId !== this.contactId) {
      this._setContactId(this.contactId);
    }
    const updatedContact = await this.ambivo.getContactStatusUpdate(this.contactId);
    const meta = this.generateMeta(updatedContact);
    this.$emit(updatedContact, meta);
  },
};
