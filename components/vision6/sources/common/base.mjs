import vision6 from "../../vision6.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    vision6,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    list: {
      propDefinition: [
        vision6,
        "list",
      ],
    },
  },
  hooks: {
    async deploy() {
      const limit = 25;
      const contacts = await this.getHistoricalEvents(limit);
      for (const contact of contacts) {
        const meta = this.generateMeta(contact);
        this.$emit(contact, meta);
      }
      this._setSince(Date.now());
    },
  },
  methods: {
    _getSince() {
      return this.db.get("since");
    },
    _setSince(since) {
      this.db.set("since", since);
    },
    _getIds() {
      return this.db.get("ids") || [];
    },
    _setIds(ids) {
      this.db.set("ids", ids);
    },
    formatSinceDate(since) {
      return `${since.toISOString().slice(0, 19)}Z..`;
    },
    getContacts() {
      throw new Error("getParams is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async getPaginatedContacts(listId, params) {
      const contacts = [];
      const limit = 100;
      let done = false;
      params = {
        ...params,
        limit,
        offset: 0,
      };

      do {
        const {
          _embedded:
          { contacts: pageContacts },
        } = await this.vision6.listContacts(listId, {
          params,
        });
        contacts.push(...pageContacts);
        params.offset += limit;
        if (pageContacts.length < limit) {
          done = true;
        }
      } while (!done);

      return contacts;
    },
  },
  async run(event) {
    const since = new Date(this._getSince());
    const contacts = await this.getContacts(since);
    for (const contact of contacts) {
      const meta = this.generateMeta(contact);
      this.$emit(contact, meta);
    }
    this._setSince(event.timestamp * 1000);
  },
};
