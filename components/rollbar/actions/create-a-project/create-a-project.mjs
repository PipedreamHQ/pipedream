import rollbar from "../../rollbar.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rollbar-create-a-project",
  name: "Create a Project",
  description: "Creates a new project in Rollbar. [See the documentation](https://docs.rollbar.com/reference/create-a-project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rollbar,
    projectName: {
      propDefinition: [
        rollbar,
        "projectName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rollbar.createProject({
      name: this.projectName,
    });
    $.export("$summary", `Successfully created project ${this.projectName}`);
    return response;
  },
};
