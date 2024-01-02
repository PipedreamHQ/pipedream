import flexmail from "../../flexmail.app.mjs";

const DEFAULT_TIMER = 15 * 60; // 15 minutes

export default {
  key: "flexmail-new-contact-update-instant",
  name: "New Contact Update Instant",
  description: "Emits an event when a contact is updated in Flexmail",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    flexmail,
    db: "$.service.db",
    contactId: {
      propDefinition: [
        flexmail,
        "contactId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_TIMER,
      },
    },
  },

  methods: {
    _getContact() {
      return this.flexmail.updateContact({
        contactId: this.contactId,
      });
    },
  },

  async run() {
    const contact = await this._getContact();

    this.$emit(contact, {
      id: contact.id,
      summary: `Contact ${contact.name} updated`,
      ts: Date.now(),
    });
  },
};
