import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

const MAX_PAGES = 100;

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
    emitContacts(contacts) {
      contacts.forEach((contact) => {
        const meta = this.generateMeta(contact);
        this.$emit(contact, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      const { contacts } = await this.app.searchContacts({
        params: {
          limit: 10,
          locationId: this.app.getLocationId(),
        },
      });
      if (contacts.length > 0) {
        this.emitContacts(contacts);
        this._setLastDate(Date.parse(contacts[0].dateAdded));
      }
    },
  },
  async run() {
    const results = [];
    const params = {
      limit: 100,
      locationId: this.app.getLocationId(),
    };
    const lastDate = this._getLastDate();
    const seenCursors = new Set();
    let total;
    let pageCount = 0;

    do {
      const cursor = JSON.stringify([
        params.startAfter,
        params.startAfterId,
      ]);
      if (seenCursors.has(cursor)) {
        break;
      }
      seenCursors.add(cursor);
      pageCount += 1;

      const {
        contacts, meta,
      } = await this.app.searchContacts({
        params,
      });
      if (!contacts.length) {
        break;
      }
      results.push(...contacts);
      total = contacts.length;
      params.startAfter = meta?.startAfter;
      params.startAfterId = meta?.startAfterId;
      if (Date.parse(contacts[0].dateAdded) <= lastDate) {
        break;
      }
    } while (pageCount < MAX_PAGES && params.startAfter && total === params.limit);

    if (!results.length) {
      return;
    }

    this.emitContacts(results);
    this._setLastDate(Date.parse(results[0].dateAdded));
  },
  sampleEmit,
};
