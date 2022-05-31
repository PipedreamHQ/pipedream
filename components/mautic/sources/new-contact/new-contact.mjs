import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";

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
      return eventTypes.CONTACT_CREATED;
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
      const { contact } = event;
      const meta = this.generateMeta(contact);
      console.log(`Emitting event - ${meta.summary}`);
      this.$emit(contact, meta);
    },
  },
};
