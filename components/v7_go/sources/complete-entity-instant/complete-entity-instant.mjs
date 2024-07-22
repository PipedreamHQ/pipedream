import { axios } from "@pipedream/platform";
import v7Go from "../../v7_go.app.mjs";

export default {
  key: "v7_go-complete-entity-instant",
  name: "V7 Go Complete Entity Instant",
  description: "Emit new event when all fields of an entity are completed in V7 Go. [See the documentation](https://docs.go.v7labs.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    v7Go,
    db: "$.service.db",
    workspaceId: {
      propDefinition: [
        v7Go,
        "workspaceId",
      ],
    },
    projectId: {
      propDefinition: [
        v7Go,
        "projectId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.emitEntityCompletionEvents();
    },
    async activate() {
      // No activation logic needed for polling source
    },
    async deactivate() {
      // No deactivation logic needed for polling source
    },
  },
  methods: {
    async emitEntityCompletionEvents() {
      const entities = await this.v7Go.listEntities({
        workspaceId: this.workspaceId,
        projectId: this.projectId,
      });

      for (const entity of entities) {
        const entityDetails = await this.v7Go.getEntity({
          workspaceId: this.workspaceId,
          projectId: this.projectId,
          entityId: entity.id,
        });

        if (this.isEntityCompleted(entityDetails)) {
          this.$emit(entityDetails, {
            id: entityDetails.id,
            summary: `Entity completed: ${entityDetails.name}`,
            ts: Date.now(),
          });
        }
      }
    },
    isEntityCompleted(entity) {
      return Object.values(entity.fields).every((field) => field !== null && field !== undefined);
    },
  },
  async run() {
    await this.emitEntityCompletionEvents();
  },
};
