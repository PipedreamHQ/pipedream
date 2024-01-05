import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "flexmail-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getContactIds() {
      return this.db.get("contactIds") || {};
    },
    _setContactIds(contactIds) {
      this.db.set("contactIds", contactIds);
    },
    getRelevantContacts(contacts) {
      const contactIds = this._getContactIds();
      const relevantContacts = [];
      const newContactIds = {};
      for (const contact of contacts) {
        if (!contactIds[contact.id]) {
          relevantContacts.push(contact);
        }
        newContactIds[contact.id] = true;
      }
      this._setContactIds(newContactIds);
      return relevantContacts;
    },
    getSummary(id) {
      return `New Contact ${id}`;
    },
  },
  sampleEmit,
};
