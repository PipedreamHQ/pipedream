import { axios } from "@pipedream/platform";
import v7Go from "../../v7_go.app.mjs";

export default {
  key: "v7_go-new-entity-instant",
  name: "New Entity Created",
  description: "Emit new event when an entity is created in V7 Go. [See the documentation](https://docs.go.v7labs.com/reference/entity-create)",
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
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLastEntityId() {
      return this.db.get("lastEntityId");
    },
    _setLastEntityId(id) {
      this.db.set("lastEntityId", id);
    },
  },
  hooks: {
    async deploy() {
      const entities = await this.v7Go.listEntities({
        workspaceId: this.workspaceId,
        projectId: this.projectId,
      });

      entities.slice(-50).forEach((entity) => {
        this.$emit(entity, {
          id: entity.id,
          summary: `New entity created: ${entity.id}`,
          ts: Date.parse(entity.created_at),
        });
      });

      if (entities.length) {
        this._setLastEntityId(entities[entities.length - 1].id);
      }
    },
    async activate() {
      // Logic to create a webhook subscription can be added here
    },
    async deactivate() {
      // Logic to delete a webhook subscription can be added here
    },
  },
  async run() {
    const lastEntityId = this._getLastEntityId();
    const entities = await this.v7Go.listEntities({
      workspaceId: this.workspaceId,
      projectId: this.projectId,
      filter: lastEntityId
        ? {
          after: lastEntityId,
        }
        : null,
    });

    entities.forEach((entity) => {
      this.$emit(entity, {
        id: entity.id,
        summary: `New entity created: ${entity.id}`,
        ts: Date.parse(entity.created_at),
      });
    });

    if (entities.length) {
      this._setLastEntityId(entities[entities.length - 1].id);
    }
  },
};
