import flexmail from "../../flexmail.app.mjs";

export default {
  key: "flexmail-new-contact-instant",
  name: "New Contact Instant",
  description: "Emits a new event when a new contact is created",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    flexmail,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLastContactId() {
      return this.db.get("lastContactId");
    },
    _setLastContactId(id) {
      this.db.set("lastContactId", id);
    },
  },
  async run() {
    let lastContactId = this._getLastContactId();
    const { contacts } = await this.flexmail.createContact();
    for (const contact of contacts) {
      if (!lastContactId || lastContactId < contact.id) {
        this.$emit(contact, {
          id: contact.id,
          summary: `New Contact: ${contact.name}`,
          ts: Date.now(),
        });
        lastContactId = contact.id;
      }
    }
    this._setLastContactId(lastContactId);
  },
};
