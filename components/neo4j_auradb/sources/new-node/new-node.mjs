import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import neo4jAuradbApp from "../../neo4j_auradb.app.mjs";

export default {
  key: "neo4j_auradb-new-node",
  name: "New Node Created",
  description: "Emit new event when a new node is created in the Neo4j AuraDB instance. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    db: {
      type: "$.service.db",
      label: "Database",
      description: "Stores the timestamp of the last processed node.",
    },
    neo4jAuradb: {
      type: "app",
      app: "neo4j_auradb",
    },
    nodeLabel: {
      propDefinition: [
        neo4jAuradbApp,
        "nodeLabel",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
      label: "Polling Interval",
      description: "How often to check for new nodes.",
    },
  },
  hooks: {
    async deploy() {
      const lastTimestamp = await this.db.get("last_timestamp") || 0;
      const query = `MATCH (n:${this.nodeLabel}) RETURN n ORDER BY n.createdAt DESC LIMIT 50`;
      const response = await this.neo4jAuradb.executeCypherQuery({
        executeCypherQuery: query,
      });
      const nodes = this.parseCypherResults(response);
      const sortedNodes = nodes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      for (const node of sortedNodes) {
        const ts = node.createdAt
          ? new Date(node.createdAt).getTime()
          : Date.now();
        const id = node.id || ts;
        this.$emit(node, {
          id: id,
          summary: `New node created with label ${this.nodeLabel}`,
          ts: ts,
        });
      }
      if (sortedNodes.length > 0) {
        const latestTimestamp = sortedNodes[sortedNodes.length - 1].createdAt;
        await this.db.set("last_timestamp", latestTimestamp);
      }
    },
    async activate() {
      // No activation logic required
    },
    async deactivate() {
      // No deactivation logic required
    },
  },
  methods: {
    parseCypherResults(response) {
      if (!response || !response.results || response.results.length === 0) {
        return [];
      }
      const data = response.results[0].data;
      return data.map((d) => d.row[0]); // assuming 'n' is the first column
    },
  },
  async run() {
    const lastTimestamp = await this.db.get("last_timestamp") || 0;
    const timestampFilter = lastTimestamp
      ? `WHERE n.createdAt > datetime("${lastTimestamp}")`
      : "";
    const query = `MATCH (n:${this.nodeLabel}) ${timestampFilter} RETURN n ORDER BY n.createdAt ASC`;
    const response = await this.neo4jAuradb.executeCypherQuery({
      executeCypherQuery: query,
    });
    const newNodes = this.parseCypherResults(response);
    for (const node of newNodes) {
      const ts = node.createdAt
        ? new Date(node.createdAt).getTime()
        : Date.now();
      const id = node.id || ts;
      this.$emit(node, {
        id: id,
        summary: `New node created with label ${this.nodeLabel}`,
        ts: ts,
      });
      if (node.createdAt && (!lastTimestamp || node.createdAt > lastTimestamp)) {
        await this.db.set("last_timestamp", node.createdAt);
      }
    }
  },
};
