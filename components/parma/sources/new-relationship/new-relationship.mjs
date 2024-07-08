import { axios } from "@pipedream/platform";
import parma from "../../parma.app.mjs";

export default {
  key: "parma-new-relationship",
  name: "New Relationship Created",
  description: "Emit new event when a new relationship is created. [See the documentation](https://developers.parma.ai/api-docs/index.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    parma,
    db: "$.service.db",
    relationshipType: {
      propDefinition: [
        parma,
        "relationshipType",
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
      const relationships = await this.parma._makeRequest({
        method: "GET",
        path: "/relationships",
      });

      relationships.slice(0, 50).forEach((relationship) => {
        this.$emit(relationship, {
          id: relationship.id,
          summary: `New Relationship: ${relationship.type}`,
          ts: Date.parse(relationship.created_at),
        });
      });
    },
    async activate() {
      // Placeholder for webhook subscription logic if needed
    },
    async deactivate() {
      // Placeholder for webhook unsubscription logic if needed
    },
  },
  methods: {
    async getNewRelationships() {
      const relationships = await this.parma._makeRequest({
        method: "GET",
        path: "/relationships",
      });
      return relationships.filter((relationship) => relationship.type === this.relationshipType);
    },
  },
  async run() {
    const newRelationships = await this.getNewRelationships();

    newRelationships.forEach((relationship) => {
      this.$emit(relationship, {
        id: relationship.id,
        summary: `New Relationship: ${relationship.type}`,
        ts: Date.parse(relationship.created_at),
      });
    });
  },
};
