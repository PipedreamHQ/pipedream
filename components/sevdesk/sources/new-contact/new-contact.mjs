import { axios } from "@pipedream/platform";
import sevdesk from "../../sevdesk.app.mjs";

export default {
  key: "sevdesk-new-contact",
  name: "New Contact Created",
  description: "Emits a new event when a contact is created in SevDesk. [See the documentation](https://api.sevdesk.de/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    sevdesk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    contactDetails: {
      propDefinition: [
        sevdesk,
        "contactDetails",
      ],
    },
  },
  methods: {
    _getLastContactId() {
      return this.db.get("lastContactId") || null;
    },
    _setLastContactId(lastContactId) {
      this.db.set("lastContactId", lastContactId);
    },
  },
  hooks: {
    async deploy() {
      // This hook is used to fetch historical data or perform an initial setup
      // Since the SevDesk API does not provide a direct way to fetch newly created contacts,
      // this example does not fetch historical data. Adjust according to actual API capabilities.
    },
    async activate() {
      // This hook is used to create a webhook subscription or other activation tasks
      // Adjust according to actual API capabilities and requirements.
    },
    async deactivate() {
      // This hook is used to delete a webhook subscription or perform cleanup tasks
      // Adjust according to actual API capabilities and requirements.
    },
  },
  async run() {
    const lastContactId = this._getLastContactId();

    // Since the SevDesk API does not provide a direct way to fetch newly created contacts,
    // this example assumes that the `contactDetails` prop is used to manually trigger
    // the event when a new contact is created. In a real-world scenario, you would
    // use an endpoint or method that lists contacts, compare against stored state,
    // and emit events for new contacts.

    // Check if the current contact is new since the last check
    if (this.contactDetails.id !== lastContactId) {
      this.$emit(this.contactDetails, {
        id: this.contactDetails.id,
        summary: `New Contact: ${this.contactDetails.name}`,
        ts: Date.now(),
      });
      this._setLastContactId(this.contactDetails.id);
    }
  },
};
