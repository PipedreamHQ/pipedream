import { axios } from "@pipedream/platform";
import satuit from "../../satuit.app.mjs";

export default {
  key: "satuit-new-contact",
  name: "New Contact Created",
  description: "Emits an event each time a new contact is created in Satuit. [See the documentation](https://satuittechnologies.zendesk.com/hc/en-us/sections/360007604994-satuitsdx-secure-data-exchange-bulk-and-rest-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    satuit,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // 1 minute
      },
    },
    contactDetails: {
      propDefinition: [
        satuit,
        "contactDetails",
      ],
    },
    contactPreferences: {
      propDefinition: [
        satuit,
        "contactPreferences",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  methods: {
    _getContactId() {
      return this.db.get("contactId") || 0;
    },
    _setContactId(contactId) {
      this.db.set("contactId", contactId);
    },
  },
  hooks: {
    async deploy() {
      // Emit events for all existing contacts during the first run
      let contactId = this._getContactId();

      while (true) {
        const response = await this.satuit.createContact({
          contact_id: contactId,
          contact_details: this.contactDetails,
          contact_preferences: this.contactPreferences,
        });

        if (response.length === 0) {
          console.log("No new contacts found");
          break;
        }

        response
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 50)
          .forEach((contact) => {
            this.$emit(contact, {
              id: contact.contact_id,
              summary: `New Contact: ${contact.first_name} ${contact.last_name}`,
              ts: Date.parse(contact.created_at),
            });
            contactId = contact.contact_id;
          });

        this._setContactId(contactId);
      }
    },
  },
  async run() {
    // Check for new contacts since the last contactId
    const contactId = this._getContactId();

    const response = await this.satuit.createContact({
      contact_id: contactId,
      contact_details: this.contactDetails,
      contact_preferences: this.contactPreferences,
    });

    response.forEach((contact) => {
      this.$emit(contact, {
        id: contact.contact_id,
        summary: `New Contact: ${contact.first_name} ${contact.last_name}`,
        ts: Date.parse(contact.created_at),
      });
      // Update the stored last contact ID
      this._setContactId(contact.contact_id);
    });
  },
};
