import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "mautic-new-contact",
  name: "New Contact",
  description: "Emit new event when a contact is created. [See the docs](https://developer.mautic.org/#webhooks)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return constants.EVENT_TYPES.CONTACT_CREATED;
    },
    getEventListFn() {
      return {
        fn: this.mautic.listContacts,
      };
    },
    isRelevant() {
      return true;
    },
    generateMeta(contact) {
      const name = `${contact.fields.core.firstname.value} ${contact.fields.core.lastname.value}`;
      const summary = `New contact: ${name}`;
      const {
        id,
        dateAdded: ts,
      } = contact;
      return {
        id,
        ts,
        summary,
      };
    },
    emitEvent(event) {
      const contact = event.contact
        ? event.contact
        : event;
      const meta = this.generateMeta(contact);
      console.log(`Emitting event - ${meta.summary}`);
      this.$emit(contact, meta);
    },
  },
};
