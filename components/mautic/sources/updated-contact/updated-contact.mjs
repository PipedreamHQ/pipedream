import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "mautic-updated-contact",
  // eslint-disable-next-line pipedream/source-name
  name: "Updated Contact",
  description: "Emit new event when a contact is updated. [See the docs](https://developer.mautic.org/#webhooks)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return constants.EVENT_TYPES.CONTACT_UPDATED;
    },
    getEventListFn() {
      return {
        fn: this.mautic.listContacts,
        params: {
          orderBy: "date_modified",
        },
      };
    },
    isRelevant(contact) {
      return contact.dateAdded !== contact.dateModified;
    },
    generateMeta(contact) {
      const name = `${contact.fields.core.firstname.value} ${contact.fields.core.lastname.value}`;
      const {
        id,
        dateModified: ts,
      } = contact;
      return {
        id: `${id}_${ts}`,
        ts,
        summary: `Updated contact: ${name}`,
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
