import rollbar from "../../rollbar.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rollbar-delete-a-project",
  name: "Delete a Project",
  description: "Deletes a project in Rollbar. [See the documentation](https://docs.rollbar.com/reference/delete-a-project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rollbar,
    projectId: {
      propDefinition: [
        rollbar,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rollbar.deleteProject({
      projectId: this.projectId,
    });
    $.export("$summary", `Successfully deleted project with ID ${this.projectId}`);
    return response;
  },
};
