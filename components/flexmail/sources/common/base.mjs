import flexmail from "../../flexmail.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  props: {
    flexmail,
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
    getRelevantContacts() {
      throw new Error("getRelevantContacts is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: this.getSummary(contact.id),
        ts: Date.now(),
      };
    },
    async getContacts() {
      const contacts = [];
      const results = this.paginateContacts();
      for await (const contact of results) {
        contacts.push(contact);
      }
      return contacts;
    },
    async *paginateContacts() {
      const limit = constants.DEFAULT_LIMIT;
      const params = {
        limit,
        offset: 0,
      };
      let total = 0;
      do {
        const { _embedded: embedded } = await this.flexmail.listContacts({
          params,
        });
        const contacts = embedded?.item || [];
        for (const contact of contacts) {
          yield contact;
        }
        total = contacts?.length;
        params.offset += limit;
      } while (total === limit);
    },
    async processEvent(limit) {
      const contacts = await this.getContacts();
      let relevantContacts = this.getRelevantContacts(contacts);
      if (limit && relevantContacts.length > limit) {
        relevantContacts = relevantContacts.slice(0, 25);
      }
      for (const contact of relevantContacts.reverse()) {
        const meta = this.generateMeta(contact);
        this.$emit(contact, meta);
      }
    },
  },
  async run() {
    await this.processEvent();
  },
};
