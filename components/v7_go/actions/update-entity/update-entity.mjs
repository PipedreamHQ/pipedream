import v7Go from "../../v7_go.app.mjs";

export default {
  key: "v7_go-update-entity",
  name: "Update Entity",
  description: "Executes an update on an existing entity. [See the documentation](https://docs.go.v7labs.com/reference/entity-update-values)",
  version: "0.0.1",
  type: "action",
  props: {
    v7Go,
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
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
    entityId: {
      propDefinition: [
        v7Go,
        "entityId",
        ({
          workspaceId, projectId,
        }) => ({
          workspaceId,
          projectId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (this.entityId) {
      return await this.v7Go.prepareProps({
        workspaceId: this.workspaceId,
        projectId: this.projectId,
        entityId: this.entityId,
      });
    }
  },
  async run({ $ }) {
    const {
      v7Go,
      workspaceId,
      projectId,
      entityId,
      ...fields
    } = this;

    const response = await v7Go.updateEntity({
      $,
      workspaceId,
      projectId,
      entityId,
      data: {
        fields: v7Go.parseObject(fields),
      },
    });

    $.export("$summary", `Successfully updated entity with ID ${response.id}`);
    return response;
  },
};
