import ragie from "../../ragie.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "ragie-new-connection",
  name: "New Ragie Connection Created",
  description: "Emits a new event whenever a new connection is created in Ragie. [See the documentation](https://docs.ragie.ai)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ragie: {
      type: "app",
      app: "ragie",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async getConnections(params = {}) {
      return await this.ragie.listConnections(params);
    },
    getLastCreatedAt() {
      return this.db.get("lastCreatedAt") || 0;
    },
    setLastCreatedAt(timestamp) {
      this.db.set("lastCreatedAt", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const connections = await this.getConnections({
        page_size: 50,
      });
      const sortedConnections = connections.connections.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );

      for (const connection of sortedConnections) {
        this.$emit(connection, {
          id: connection.id,
          summary: `New Ragie Connection: ${connection.name || connection.id}`,
          ts: Date.parse(connection.created_at),
        });
      }

      if (sortedConnections.length > 0) {
        const latestCreatedAt = sortedConnections[0].created_at;
        this.setLastCreatedAt(Date.parse(latestCreatedAt));
      }
    },
    async activate() {
      // No webhook subscription needed for polling
    },
    async deactivate() {
      // No cleanup needed for polling
    },
  },
  async run() {
    let cursor = null;
    let hasMore = true;
    let latestCreatedAt = this.getLastCreatedAt();
    const newConnections = [];

    while (hasMore) {
      const params = {
        page_size: 100,
      };
      if (cursor) {
        params.cursor = cursor;
      }

      const response = await this.getConnections(params);
      const connections = response.connections;

      for (const connection of connections) {
        const connectionCreatedAt = Date.parse(connection.created_at);
        if (connectionCreatedAt > latestCreatedAt) {
          newConnections.push(connection);
        } else {
          hasMore = false;
          break;
        }
      }

      cursor = response.pagination?.next_cursor;
      if (!cursor) {
        hasMore = false;
      }
    }

    if (newConnections.length > 0) {
      newConnections.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      for (const connection of newConnections) {
        this.$emit(connection, {
          id: connection.id,
          summary: `New Ragie Connection: ${connection.name || connection.id}`,
          ts: Date.parse(connection.created_at),
        });
      }

      const mostRecentConnection = newConnections[newConnections.length - 1];
      this.setLastCreatedAt(Date.parse(mostRecentConnection.created_at));
    }
  },
};
