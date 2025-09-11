import common from "../common/base-polling.mjs";
import md5 from "md5";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "highlevel_oauth-contact-updated",
  name: "Contact Updated",
  description: "Emit new event when an existing contact is updated. [See the documentation](https://highlevel.stoplight.io/docs/integrations/ab55933a57f6f-get-contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getContactValues() {
      return this.db.get("contactValues") || {};
    },
    _setContactValues(contactValues) {
      this.db.set("contactValues", contactValues);
    },
    generateMeta(contact) {
      const ts = Date.now();
      return {
        id: `${contact.id}${ts}`,
        summary: `Contact Updated w/ ID: ${contact.id}`,
        ts,
      };
    },
  },
  async run() {
    const results = [];
    const params = {
      limit: 100,
      locationId: this.app.getLocationId(),
    };
    let total;
    const contactValues = this._getContactValues();
    const newContactValues = {};

    do {
      const {
        contacts, meta,
      } = await this.app.searchContacts({
        params,
      });
      for (const contact of contacts) {
        const hash = md5(JSON.stringify(contact));
        if (contactValues[contact.id] && contactValues[contact.id] !== hash) {
          results.push(contact);
        }
        newContactValues[contact.id] = hash;
      }
      params.startAfter = meta?.startAfter;
      total = meta?.total;
    } while (results.length < total);

    results.forEach((contact) => {
      const meta = this.generateMeta(contact);
      this.$emit(contact, meta);
    });

    this._setContactValues(newContactValues);
  },
  sampleEmit,
};
