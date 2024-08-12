import { axios } from "@pipedream/platform";
import rentman from "../../rentman.app.mjs";

export default {
  key: "rentman-new-item-created",
  name: "New Item Created",
  description: "Emit new event when an item is created. [See the documentation](https://api.rentman.net/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rentman,
    db: "$.service.db",
    itemType: {
      propDefinition: [
        rentman,
        "itemType",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const items = await this.getItems();
      for (const item of items.slice(0, 50)) {
        this.emitEvent(item);
      }
    },
    async activate() {
      // Implement webhook subscription logic if available
    },
    async deactivate() {
      // Implement webhook unsubscription logic if available
    },
  },
  methods: {
    _getLastCreatedId() {
      return this.db.get("lastCreatedId") || null;
    },
    _setLastCreatedId(id) {
      this.db.set("lastCreatedId", id);
    },
    async getItems() {
      const itemType = this.itemType;
      const lastCreatedId = this._getLastCreatedId();
      const path = `/items/${itemType}`;
      const params = lastCreatedId
        ? {
          since_id: lastCreatedId,
        }
        : {};
      return this.rentman._makeRequest({
        method: "GET",
        path,
        params,
      });
    },
    emitEvent(item) {
      this.$emit(item, {
        id: item.id,
        summary: `New ${this.itemType} created: ${item.name}`,
        ts: Date.parse(item.created_at),
      });
    },
  },
  async run() {
    const items = await this.getItems();
    if (items.length > 0) {
      items.forEach((item) => this.emitEvent(item));
      this._setLastCreatedId(items[0].id);
    }
  },
};
