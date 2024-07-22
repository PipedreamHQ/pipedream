import v7_go from "../../v7_go.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "v7_go-update-entity",
  name: "Update Entity",
  description: "Executes an update on an existing entity. [See the documentation](https://docs.go.v7labs.com/reference/entity-update-values)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    v7_go,
    workspaceId: {
      propDefinition: [
        v7_go,
        "workspaceId",
      ],
    },
    projectId: {
      propDefinition: [
        v7_go,
        "projectId",
      ],
    },
    entityId: {
      propDefinition: [
        v7_go,
        "entityId",
      ],
    },
    entityType: {
      propDefinition: [
        v7_go,
        "entityType",
      ],
    },
    entityIdentifier: {
      propDefinition: [
        v7_go,
        "entityIdentifier",
      ],
    },
    newAttributes: {
      propDefinition: [
        v7_go,
        "newAttributes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.v7_go.updateEntity({
      workspaceId: this.workspaceId,
      projectId: this.projectId,
      entityId: this.entityId,
      newAttributes: this.newAttributes,
    });

    $.export("$summary", `Successfully updated entity with ID ${this.entityId}`);
    return response;
  },
};
