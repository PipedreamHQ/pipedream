import airfocus from "../../airfocus.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "airfocus-new-item-created",
  name: "New Item Created",
  description: "Emit new event when a fresh item is created. [See the documentation](https://developer.airfocus.com/endpoints.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    airfocus,
    db: "$.service.db",
    workspaceId: {
      propDefinition: [
        airfocus,
        "workspaceId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Polling every 15 minutes
      },
    },
  },
  methods: {
    _getLastCreatedAt() {
      return this.db.get("lastCreatedAt") || 0;
    },
    _setLastCreatedAt(timestamp) {
      this.db.set("lastCreatedAt", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const items = await this.airfocus.emitNewItemCreatedEvent(this.workspaceId);
      const sortedItems = items.sort((a, b) => new Date(b.createdat) - new Date(a.createdat));

      for (const item of sortedItems.slice(0, 50)) {
        this.$emit(item, {
          id: item.id,
          summary: `New Item: ${item.name}`,
          ts: Date.parse(item.createdat),
        });
      }

      if (sortedItems.length > 0) {
        this._setLastCreatedAt(Date.parse(sortedItems[0].createdat));
      }
    },
    async activate() {
      // Logic for webhook subscription can be added here if needed
    },
    async deactivate() {
      // Logic for webhook unsubscription can be added here if needed
    },
  },
  async run() {
    const lastCreatedAt = this._getLastCreatedAt();
    const items = await this.airfocus.emitNewItemCreatedEvent(this.workspaceId);
    const newItems = items.filter((item) => Date.parse(item.createdat) > lastCreatedAt);

    for (const item of newItems) {
      this.$emit(item, {
        id: item.id,
        summary: `New Item: ${item.name}`,
        ts: Date.parse(item.createdat),
      });
    }

    if (newItems.length > 0) {
      this._setLastCreatedAt(Date.parse(newItems[0].createdat));
    }
  },
};
