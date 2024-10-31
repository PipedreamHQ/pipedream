import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import checkvist from "../../checkvist.app.mjs";

export default {
  key: "checkvist-new-list-item",
  name: "New List Item Added",
  description: "Emit new event when a new list item is added in a selected list. [See the documentation](https://checkvist.com/auth/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    checkvist,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    listId: {
      propDefinition: [
        checkvist,
        "listId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.emitRecentItems();
    },
  },
  methods: {
    async emitRecentItems() {
      const items = await this.checkvist.watchNewListItems({
        listId: this.listId,
      });
      items.slice(0, 50).forEach((item) => {
        this.$emit(item, {
          id: `${item.id}`,
          summary: `New Item: ${item.content}`,
          ts: Date.parse(item.created_at),
        });
      });
      this._setLastItemId(items[0]?.id);
    },
    _getLastItemId() {
      return this.db.get("lastItemId");
    },
    _setLastItemId(id) {
      this.db.set("lastItemId", id);
    },
  },
  async run() {
    const lastItemId = this._getLastItemId();

    const items = await this.checkvist.watchNewListItems({
      listId: this.listId,
    });

    for (const item of items) {
      if (!lastItemId || item.id > lastItemId) {
        this.$emit(item, {
          id: `${item.id}`,
          summary: `New Item: ${item.content}`,
          ts: Date.parse(item.created_at),
        });
      }
    }

    if (items.length > 0) {
      this._setLastItemId(items[0].id);
    }
  },
};
