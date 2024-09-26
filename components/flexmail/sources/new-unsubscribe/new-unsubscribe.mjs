import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "flexmail-new-unsubscribe",
  name: "New Unsubscribe",
  description: "Emit new event when a contact unsubscribes.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getContactIds() {
      return this.db.get("contactIds") || [];
    },
    _setContactIds(contactIds) {
      this.db.set("contactIds", contactIds);
    },
    getRelevantContacts(contacts) {
      const contactIds = this._getContactIds();
      const relevantContacts = [];
      const newContactIds = contacts.map(({ id }) => id);
      for (const id of contactIds) {
        if (!newContactIds.includes(id)) {
          relevantContacts.push({
            id,
          });
        }
      }
      this._setContactIds(newContactIds);
      return relevantContacts;
    },
    getSummary(id) {
      return `Contact Unsubscribed ${id}`;
    },
  },
  sampleEmit,
};
