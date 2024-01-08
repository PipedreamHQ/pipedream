import common from "../common/base.mjs";
import md5 from "md5";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "flexmail-new-contact-updated",
  name: "New Contact Updated",
  description: "Emit new event when a contact is updated in Flexmail",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getContacts() {
      return this.db.get("contacts") || {};
    },
    _setContacts(contacts) {
      this.db.set("contacts", contacts);
    },
    getRelevantContacts(contacts) {
      const existingContacts = this._getContacts();
      const relevantContacts = [];
      const newContacts = {};
      for (const contact of contacts) {
        const hash = md5(JSON.stringify(contact));
        if (existingContacts[contact.id] && existingContacts[contact.id] != hash) {
          relevantContacts.push(contact);
        }
        newContacts[contact.id] = hash;
      }
      this._setContacts(newContacts);
      return relevantContacts;
    },
    getSummary(id) {
      return `Contact Updated ${id}`;
    },
  },
  sampleEmit,
};
