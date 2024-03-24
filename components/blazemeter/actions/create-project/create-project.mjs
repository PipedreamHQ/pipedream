import blazemeter from "../../blazemeter.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "blazemeter-create-project",
  name: "Create Project",
  description: "Creates a new project in a specific workspace. [See the documentation](https://api.blazemeter.com/functional/#create-a-project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    blazemeter,
    workspaceId: {
      propDefinition: [
        blazemeter,
        "workspaceId",
      ],
    },
    projectName: {
      propDefinition: [
        blazemeter,
        "projectName",
      ],
    },
    projectDescription: {
      propDefinition: [
        blazemeter,
        "projectDescription",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.blazemeter.createProject({
      name: this.projectName,
      description: this.projectDescription,
      workspaceId: this.workspaceId,
    });

    $.export("$summary", `Successfully created project '${this.projectName}' in workspace ID ${this.workspaceId}`);
    return response;
  },
};
