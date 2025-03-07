import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import neo4jAuradb from "../../neo4j_auradb.app.mjs";

export default {
  key: "neo4j_auradb-new-relationship",
  name: "New Relationship Created",
  description: "Emit a new event when a new relationship is created between nodes in the Neo4j AuraDB instance. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    neo4jAuradb: {
      type: "app",
      app: "neo4j_auradb",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    relationshipType: {
      type: "string",
      label: "Relationship Type",
      description: "The type of the relationship to filter events for new relationship creation.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const lastTimestamp = 0;
      let cypher = "MATCH ()-[r]->() RETURN r ORDER BY r.created ASC LIMIT 50";
      const params = {};

      if (this.relationshipType) {
        cypher = `MATCH ()-[r:${this.relationshipType}]->() RETURN r ORDER BY r.created ASC LIMIT 50`;
      }

      const relationships = await this.neo4jAuradb.executeCypherQuery({
        executeCypherQuery: cypher,
        ...params,
      });

      let latestTimestamp = lastTimestamp;

      for (const record of relationships) {
        const relationship = record.r;
        const ts = relationship.created
          ? new Date(relationship.created).getTime()
          : Date.now();
        latestTimestamp = Math.max(latestTimestamp, ts);

        this.$emit(
          relationship,
          {
            id: relationship.id
              ? relationship.id.toString()
              : ts.toString(),
            summary: `New Relationship${this.relationshipType
              ? `: ${relationship.type}`
              : ""}`,
            ts,
          },
        );
      }

      await this.db.set("lastTimestamp", latestTimestamp);
    },
    async activate() {
      // No webhook to create for polling source
    },
    async deactivate() {
      // No webhook to delete for polling source
    },
  },
  async run() {
    const lastTimestamp = (await this.db.get("lastTimestamp")) || 0;
    let cypher = "MATCH ()-[r]->() WHERE r.created > $lastTimestamp RETURN r ORDER BY r.created ASC";
    const params = {
      lastTimestamp: lastTimestamp,
    };

    if (this.relationshipType) {
      cypher = `MATCH ()-[r:${this.relationshipType}]->() WHERE r.created > $lastTimestamp RETURN r ORDER BY r.created ASC`;
    }

    const relationships = await this.neo4jAuradb.executeCypherQuery({
      executeCypherQuery: cypher,
      ...params,
    });

    let latestTimestamp = lastTimestamp;

    for (const record of relationships) {
      const relationship = record.r;
      const ts = relationship.created
        ? new Date(relationship.created).getTime()
        : Date.now();
      latestTimestamp = Math.max(latestTimestamp, ts);

      this.$emit(
        relationship,
        {
          id: relationship.id
            ? relationship.id.toString()
            : ts.toString(),
          summary: `New Relationship${this.relationshipType
            ? `: ${relationship.type}`
            : ""}`,
          ts,
        },
      );
    }

    await this.db.set("lastTimestamp", latestTimestamp);
  },
};
