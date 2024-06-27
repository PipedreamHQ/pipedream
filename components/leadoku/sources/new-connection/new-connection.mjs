import { axios } from "@pipedream/platform";
import leadoku from "../../leadoku.app.mjs";

export default {
  key: "leadoku-new-connection",
  name: "New Connection",
  description: "Emits an event each time a new connection is made in Leadoku",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    leadoku: {
      type: "app",
      app: "leadoku",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getCursor() {
      return this.db.get("cursor") || null;
    },
    _setCursor(cursor) {
      this.db.set("cursor", cursor);
    },
  },
  async run() {
    const lastCursor = this._getCursor();

    const params = lastCursor
      ? {
        start_after: lastCursor,
      }
      : {};

    const { connections } = await this.leadoku._makeRequest({
      path: "/connections",
      params,
    });

    if (!connections || !connections.length) {
      console.log("No new connections found");
      return;
    }

    for (const connection of connections) {
      this.$emit(connection, {
        id: connection.id,
        summary: `New connection: ${connection.name}`,
        ts: Date.parse(connection.created_at),
      });
    }

    const latestCursor = connections[connections.length - 1].id;
    this._setCursor(latestCursor);
  },
};
