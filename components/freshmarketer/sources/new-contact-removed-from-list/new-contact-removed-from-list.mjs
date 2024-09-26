import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "freshmarketer-new-contact-removed-from-list",
  name: "New Contact Removed From List",
  description: "Emit new event as soon as a contact is removed from a list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(contact) {
      return `Contact ${contact.email} removed from list`;
    },
    _getContacts() {
      return this.db.get("contacts") || [];
    },
    _setContacts(contacts) {
      this.db.set("contacts", contacts);
    },
    async prepareData({ data }) {
      const contacts = this._getContacts();

      let newData = [];
      for await (const {
        id, email,
      } of data) {
        newData.push({
          id,
          email,
        });
      }

      this._setContacts(newData);

      let idsArray = [];
      for (const { id } of newData) {
        idsArray.push(id);
      }

      const filteredIds = contacts.filter((item) => !idsArray.includes(item.id));

      const responseArray = [];
      if (filteredIds.length) {
        for (const item of filteredIds) {
          responseArray.push(item);
        }
      }
      return responseArray;
    },
  },
  sampleEmit,
};
