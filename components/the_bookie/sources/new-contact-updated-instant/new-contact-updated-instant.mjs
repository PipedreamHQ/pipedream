import theBookie from "../../the_bookie.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "the_bookie-new-contact-updated-instant",
  name: "New Contact Created or Updated",
  description: "Emit new event when a contact is created or updated. [See the documentation](https://app.thebookie.nl/nl/help/category/developers/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    theBookie,
    addressBookId: {
      propDefinition: [
        theBookie,
        "addressBookId",
      ],
    },
    contactId: {
      propDefinition: [
        theBookie,
        "contactId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents();
    },
    async activate() {
      await this.processEvents();
    },
    async deactivate() {
      // Perform any necessary cleanup
    },
  },
  methods: {
    async processEvents() {
      const events = await this.theBookie.emitContactCreatedUpdated({
        addressBookId: this.addressBookId,
        contactId: this.contactId,
      });
      events.forEach((event) => {
        this.$emit(event, {
          id: event.contactId,
          summary: `Contact created/updated: ${event.contactId}`,
          ts: Date.now(),
        });
      });
    },
  },
  async run() {
    await this.processEvents();
  },
};
