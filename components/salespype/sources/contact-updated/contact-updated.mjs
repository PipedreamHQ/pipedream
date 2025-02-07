import salespype from "../../salespype.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "salespype-contact-updated",
  name: "Salespype Contact Updated",
  description: "Emit a new event when an existing contact is updated. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    salespype,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    contactId: {
      propDefinition: [
        salespype,
        "contactId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const contact = await this.fetchContact();
      if (contact) {
        this.$emit(contact, {
          summary: `Contact Updated: ${contact.first_name} ${contact.last_name}`,
          ts: new Date(contact.updated_at).getTime(),
        });
        await this.db.set(`contact_${this.contactId}`, contact.updated_at);
      }
    },
    async activate() {
      // No webhook setup required for polling source
    },
    async deactivate() {
      // No webhook teardown required for polling source
    },
  },
  async run() {
    const contact = await this.fetchContact();
    if (contact) {
      const lastUpdated = await this.db.get(`contact_${this.contactId}`);
      const currentUpdated = contact.updated_at;

      if (!lastUpdated || new Date(currentUpdated) > new Date(lastUpdated)) {
        this.$emit(contact, {
          summary: `Contact Updated: ${contact.first_name} ${contact.last_name}`,
          ts: new Date(currentUpdated).getTime(),
        });
        await this.db.set(`contact_${this.contactId}`, currentUpdated);
      }
    }
  },
  methods: {
    async fetchContact() {
      try {
        const contact = await this.salespype._makeRequest({
          method: "GET",
          path: `/contacts/${this.contactId}`,
        });
        return contact;
      } catch (error) {
        this.$emitError(error);
      }
    },
  },
};
