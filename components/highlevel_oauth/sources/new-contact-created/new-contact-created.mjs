import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "highlevel_oauth-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the documentation](https://marketplace.gohighlevel.com/docs/ghl/contacts/get-contacts)",
  version: "0.0.2",
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
      startAfter: this._getLastDate(),
      locationId: this.app.getLocationId(),
    };
    let total;

    do {
      const {
        contacts, meta,
      } = await this.app.searchContacts({
        params,
      });
      results.push(...contacts);
      params.startAfter = meta?.startAfter;
      total = meta?.total;
    } while (results.length < total);

    this._setLastDate(params.startAfter);

    results.forEach((contact) => {
      const meta = this.generateMeta(contact);
      this.$emit(contact, meta);
    });
  },
  sampleEmit,
};
