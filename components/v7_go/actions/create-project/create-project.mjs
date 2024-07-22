import v7Go from "../../v7_go.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "v7_go-create-project",
  name: "Create Project",
  description: "Initiates the creation of a new project with a unique project identifier. [See the documentation](https://docs.go.v7labs.com/reference/project-create)",
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
    name: {
      propDefinition: [
        v7Go,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.v7Go.createProject({
      workspaceId: this.workspaceId,
      name: this.name,
    });
    $.export("$summary", `Successfully created project with ID ${response.id}`);
    return response;
  },
};
