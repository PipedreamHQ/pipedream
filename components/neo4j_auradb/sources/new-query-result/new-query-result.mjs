import { axios } from "@pipedream/platform";
import neo4jAuradb from "../../neo4j_auradb.app.mjs";

export default {
  key: "neo4j_auradb-new-query-result",
  name: "New Query Result",
  description: "Emits a new event when a specified Cypher query returns new results. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    neo4jAuradb: {
      type: "app",
      app: "neo4j_auradb",
    },
    monitorCypherQuery: {
      propDefinition: [
        "neo4j_auradb",
        "monitorCypherQuery",
      ],
    },
    db: {
      type: "$.service.db",
      label: "Database",
      description: "Database for storing state.",
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
      const results = await this.neo4jAuradb.emitCypherQueryEvent({
        monitorCypherQuery: this.monitorCypherQuery,
      });
      const sortedResults = results.sort((a, b) => {
        if (a.ts && b.ts) return b.ts - a.ts;
        if (a.id && b.id) return b.id - a.id;
        return 0;
      });
      const eventsToEmit = sortedResults.slice(0, 50).reverse();
      for (const result of eventsToEmit) {
        const id = result.id || result.ts || Date.now();
        const ts = result.ts || Date.now();
        this.$emit(result, {
          id: id.toString(),
          summary: "New query result",
          ts,
        });
      }
      if (eventsToEmit.length > 0) {
        const lastResult = eventsToEmit[eventsToEmit.length - 1];
        const lastId = lastResult.id || lastResult.ts || Date.now();
        const lastTs = lastResult.ts || Date.now();
        await this.db.set("last_id", lastId);
        await this.db.set("last_ts", lastTs);
      }
    },
    async activate() {
      // No activation steps needed
    },
    async deactivate() {
      // No deactivation steps needed
    },
  },
  async run() {
    const results = await this.neo4jAuradb.emitCypherQueryEvent({
      monitorCypherQuery: this.monitorCypherQuery,
    });
    const sortedResults = results.sort((a, b) => {
      if (a.ts && b.ts) return a.ts - b.ts;
      if (a.id && b.id) return a.id - b.id;
      return 0;
    });
    const lastId = await this.db.get("last_id");
    const lastTs = await this.db.get("last_ts");
    let newLastId = lastId;
    let newLastTs = lastTs;
    for (const result of sortedResults) {
      const currentId = result.id;
      const currentTs = result.ts;
      let isNew = false;
      if (currentId && lastId && currentId > lastId) {
        isNew = true;
      } else if (currentTs && lastTs && currentTs > lastTs) {
        isNew = true;
      } else if (!lastId && !lastTs) {
        isNew = true;
      }
      if (isNew) {
        const emitId = currentId || currentTs || Date.now();
        const emitTs = currentTs || Date.now();
        this.$emit(result, {
          id: emitId.toString(),
          summary: "New query result",
          ts: emitTs,
        });
        if (emitId > newLastId) {
          newLastId = emitId;
        }
        if (emitTs > newLastTs) {
          newLastTs = emitTs;
        }
      }
    }
    if (newLastId !== lastId) {
      await this.db.set("last_id", newLastId);
    }
    if (newLastTs !== lastTs) {
      await this.db.set("last_ts", newLastTs);
    }
  },
};
