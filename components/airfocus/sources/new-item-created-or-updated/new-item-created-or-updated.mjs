import { axios } from "@pipedream/platform";
import airfocus from "../../airfocus.app.mjs";

export default {
  key: "airfocus-new-item-created-or-updated",
  name: "New Item Created or Updated",
  description: "Emit new event when a new item is created or an existing one is updated. [See the documentation](https://developer.airfocus.com/endpoints.html)",
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
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLastCreatedAt() {
      return this.db.get("lastCreatedAt");
    },
    _setLastCreatedAt(lastCreatedAt) {
      this.db.set("lastCreatedAt", lastCreatedAt);
    },
    _getLastUpdatedAt() {
      return this.db.get("lastUpdatedAt");
    },
    _setLastUpdatedAt(lastUpdatedAt) {
      this.db.set("lastUpdatedAt", lastUpdatedAt);
    },
    async _fetchItems(workspaceId, sort) {
      return this.airfocus._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/items/search`,
        data: {
          sort,
        },
      });
    },
  },
  hooks: {
    async deploy() {
      const workspaceId = this.workspaceId;
      const createdItems = await this._fetchItems(workspaceId, "createdat");
      const updatedItems = await this._fetchItems(workspaceId, "lastupdatedat");

      const allItems = [
        ...createdItems,
        ...updatedItems,
      ];
      allItems.sort((a, b) => new Date(b.createdat) - new Date(a.createdat));

      for (const item of allItems.slice(0, 50)) {
        this.$emit(item, {
          id: item.id,
          summary: `New or Updated Item: ${item.name}`,
          ts: Date.parse(item.createdat),
        });
      }

      if (createdItems.length) {
        this._setLastCreatedAt(createdItems[0].createdat);
      }

      if (updatedItems.length) {
        this._setLastUpdatedAt(updatedItems[0].lastupdatedat);
      }
    },
  },
  async run() {
    const workspaceId = this.workspaceId;
    const lastCreatedAt = this._getLastCreatedAt();
    const lastUpdatedAt = this._getLastUpdatedAt();

    const createdItems = await this._fetchItems(workspaceId, "createdat");
    const updatedItems = await this._fetchItems(workspaceId, "lastupdatedat");

    for (const item of createdItems) {
      if (!lastCreatedAt || new Date(item.createdat) > new Date(lastCreatedAt)) {
        this.$emit(item, {
          id: item.id,
          summary: `New Item: ${item.name}`,
          ts: Date.parse(item.createdat),
        });
      }
    }

    for (const item of updatedItems) {
      if (!lastUpdatedAt || new Date(item.lastupdatedat) > new Date(lastUpdatedAt)) {
        this.$emit(item, {
          id: item.id,
          summary: `Updated Item: ${item.name}`,
          ts: Date.parse(item.lastupdatedat),
        });
      }
    }

    if (createdItems.length) {
      this._setLastCreatedAt(createdItems[0].createdat);
    }

    if (updatedItems.length) {
      this._setLastUpdatedAt(updatedItems[0].lastupdatedat);
    }
  },
};
