import v7Go from "../../v7_go.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "v7_go-create-entity",
  name: "Create Entity",
  description: "Triggers the creation of a new entity. [See the documentation](https://docs.go.v7labs.com/reference/create-entities-programmatically)",
  version: "0.0.{{ts}}",
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
      ],
    },
    fields: {
      propDefinition: [
        v7Go,
        "fields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.v7Go.createEntity({
      workspaceId: this.workspaceId,
      projectId: this.projectId,
      fields: this.fields,
    });

    $.export("$summary", `Successfully created entity with ID ${response.id}`);
    return response;
  },
};
