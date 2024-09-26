import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import freshmarketer from "../../freshmarketer.app.mjs";

export default {
  props: {
    freshmarketer,
    db: "$.service.db",
    listId: {
      propDefinition: [
        freshmarketer,
        "listId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01T00:00:00Z";
    },
    _setLastDate(updatedAt) {
      this.db.set("lastDate", updatedAt);
    },
    generateMeta(contact) {
      const ts = Date.parse(contact.updated_at || new Date());
      return {
        id: `${contact.id}-${ts}`,
        summary: this.getSummary(contact),
        ts: ts,
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();

      const data = this.freshmarketer.paginate({
        fn: this.freshmarketer.listContacts,
        listId: this.listId,
        params: {
          sort: "updated_at",
          sort_type: "desc",
        },
      });

      const responseArray = await this.prepareData({
        data,
        lastDate,
        maxResults,
      });

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
