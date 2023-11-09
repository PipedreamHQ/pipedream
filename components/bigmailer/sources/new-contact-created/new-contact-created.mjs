import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import bigmailer from "../../bigmailer.app.mjs";

export default {
  key: "bigmailer-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    bigmailer,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    brandId: {
      propDefinition: [
        bigmailer,
        "brandId",
      ],
    },
  },
  methods: {
    _getLastContactId() {
      return this.db.get("lastContactId") ?? 0;
    },
    _setLastContactId(lastContactId) {
      this.db.set("lastContactId", lastContactId);
    },
  },
  async run() {
    const lastContactId = this._getLastContactId();
    let newLastContactId = lastContactId;

    const contacts = await this.bigmailer.listContacts({
      brandId: this.brandId,
    });
    // Sort the contacts by most recent
    const sortedContacts = contacts.sort((a, b) => b.id - a.id);
    for (const contact of sortedContacts) {
      if (contact.id > lastContactId) {
        this.$emit(contact, {
          id: contact.id,
          summary: `New Contact: ${contact.email}`,
          ts: Date.now(),
        });
        newLastContactId = Math.max(newLastContactId, contact.id);
      }
    }
    this._setLastContactId(newLastContactId);
  },
};
