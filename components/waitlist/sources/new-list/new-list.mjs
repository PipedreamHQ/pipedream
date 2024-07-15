import waitlist from "../../waitlist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "waitlist-new-list",
  name: "New List Created",
  description: "Emit new event each time a list is created. [See the documentation](https://getwaitlist.com/docs/api-docs/waitlist)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    waitlist,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLastListId() {
      return this.db.get("lastListId");
    },
    _setLastListId(listId) {
      this.db.set("lastListId", listId);
    },
    async getLists() {
      return this.waitlist._makeRequest({
        path: "/waitlist",
      });
    },
  },
  hooks: {
    async deploy() {
      const lists = await this.getLists();
      if (lists.length > 0) {
        this._setLastListId(lists[0].id);
        for (const list of lists.slice(0, 50)) {
          this.$emit(list, {
            id: list.id,
            summary: `New list created: ${list.waitlist_name}`,
            ts: Date.parse(list.created_at),
          });
        }
      }
    },
    async activate() {
      // Hook to handle activation logic if necessary
    },
    async deactivate() {
      // Hook to handle deactivation logic if necessary
    },
  },
  async run() {
    const lastListId = this._getLastListId();
    const lists = await this.getLists();
    for (const list of lists) {
      if (list.id === lastListId) break;
      this.$emit(list, {
        id: list.id,
        summary: `New list created: ${list.waitlist_name}`,
        ts: Date.parse(list.created_at),
      });
    }
    if (lists.length > 0) {
      this._setLastListId(lists[0].id);
    }
  },
};
