import suitedash from "../../suitedash.app.mjs";

export default {
  key: "suitedash-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    suitedash,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getContactId(contact) {
      return contact.id;
    },
    _getContactTimestamp(contact) {
      return Date.parse(contact.created_at);
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun") || this.timer.timestamp;
    const params = {
      created_after: new Date(lastRun).toISOString(),
    };
    const contacts = await this.suitedash.getContacts(params);
    for (const contact of contacts) {
      const contactId = this._getContactId(contact);
      const contactTimestamp = this._getContactTimestamp(contact);
      this.$emit(contact, {
        id: contactId,
        summary: `New Contact: ${contact.first_name} ${contact.last_name}`,
        ts: contactTimestamp,
      });
    }
    this.db.set("lastRun", this.timer.timestamp);
  },
};
