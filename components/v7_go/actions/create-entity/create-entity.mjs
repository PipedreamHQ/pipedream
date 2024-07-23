import v7Go from "../../v7_go.app.mjs";

export default {
  key: "v7_go-create-entity",
  name: "Create Entity",
  description: "Triggers the creation of a new entity. [See the documentation](https://docs.go.v7labs.com/reference/create-entities-programmatically)",
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
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (this.projectId) {
      return await this.v7Go.prepareProps({
        workspaceId: this.workspaceId,
        projectId: this.projectId,
      });
    }
  },
  async run({ $ }) {
    const {
      v7Go,
      workspaceId,
      projectId,
      ...fields
    } = this;

    const response = await v7Go.createEntity({
      $,
      workspaceId,
      projectId,
      data: {
        fields: v7Go.parseObject(fields),
      },
    });

    $.export("$summary", `Successfully created entity with ID ${response.id}`);
    return response;
  },
};
