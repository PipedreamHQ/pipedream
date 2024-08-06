import { axios } from "@pipedream/platform";
import airfocus from "../../airfocus.app.mjs";

export default {
  key: "airfocus-new-item-updated",
  name: "New Item Updated",
  description: "Emit new event when an existing item gets updated. [See the documentation](https://developer.airfocus.com/endpoints.html)",
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
        intervalSeconds: 900, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      const items = await this.airfocus.emitItemUpdatedEvent(this.workspaceId);
      for (const item of items.slice(0, 50)) {
        this.$emit(item, {
          id: item.id,
          summary: `Item updated: ${item.name}`,
          ts: Date.parse(item.lastupdatedat),
        });
      }
    },
    async activate() {
      // Optional: Add any activation logic here, e.g., creating a webhook
    },
    async deactivate() {
      // Optional: Add any deactivation logic here, e.g., deleting a webhook
    },
  },
  methods: {
    _getLastUpdatedAt() {
      return this.db.get("lastUpdatedAt") || null;
    },
    _setLastUpdatedAt(lastUpdatedAt) {
      this.db.set("lastUpdatedAt", lastUpdatedAt);
    },
  },
  async run() {
    const lastUpdatedAt = this._getLastUpdatedAt();
    const items = await this.airfocus.emitItemUpdatedEvent(this.workspaceId);

    for (const item of items) {
      if (!lastUpdatedAt || Date.parse(item.lastupdatedat) > lastUpdatedAt) {
        this.$emit(item, {
          id: item.id,
          summary: `Item updated: ${item.name}`,
          ts: Date.parse(item.lastupdatedat),
        });
      }
    }

    if (items.length > 0) {
      this._setLastUpdatedAt(Date.parse(items[0].lastupdatedat));
    }
  },
};
