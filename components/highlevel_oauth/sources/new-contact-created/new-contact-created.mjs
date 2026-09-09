import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "highlevel_oauth-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the documentation](https://marketplace.gohighlevel.com/docs/ghl/contacts/get-contacts)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact ID: ${contact.id}`,
        ts: Date.parse(contact.dateAdded),
      };
    },
  },
  async run() {
    const results = [];
    const params = {
      limit: 100,
      locationId: this.app.getLocationId(),
    };
    const lastDate = this._getLastDate();
    let total;

    do {
      const {
        contacts, meta,
      } = await this.app.searchContacts({
        params,
      });
      results.push(...contacts);
      total = contacts.length;
      params.startAfter = meta?.startAfter;
      params.startAfterId = meta?.startAfterId;
      if (Date.parse(contacts[0].dateAdded) <= lastDate) {
        break;
      }
    } while (params.startAfter && total === params.limit);

    if (!results.length) {
      return;
    }

    this._setLastDate(Date.parse(results[0].dateAdded));

    results.forEach((contact) => {
      const meta = this.generateMeta(contact);
      this.$emit(contact, meta);
    });
  },
  sampleEmit,
};
