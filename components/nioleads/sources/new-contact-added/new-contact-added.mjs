import nioleads from "../../nioleads.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "nioleads-new-contact-added",
  name: "New Contact Added",
  description: "Emit new event when a new contact is added. [See the documentation](https://apidoc.nioleads.com/?_gl=1*1288vdg*_ga*MTY1NzE1MjMzOC4xNzI1OTM5Njk1*_ga_ZVT2YHDDZG*MTcyNTk0Mzk5NC4yLjAuMTcyNTk0NDAyMy4wLjAuMA..#contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    nioleads,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact: ${contact.name}`,
        ts: Date.now(),
      };
    },
    async processEvent(limit) {
      const lastId = this._getLastId();
      const contacts = await this.nioleads.listContacts();
      if (!contacts?.length) {
        return;
      }
      const newContacts = contacts.filter(({ id }) => id > lastId);
      if (limit && newContacts.length > limit) {
        newContacts.length = limit;
      }
      this._setLastId(newContacts[0].id);
      newContacts.reverse().forEach((contact) => {
        const meta = this.generateMeta(contact);
        this.$emit(contact, meta);
      });
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
