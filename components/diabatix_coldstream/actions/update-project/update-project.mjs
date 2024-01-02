import coldstream from "../../coldstream.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diabatix_coldstream-update-project",
  name: "Update Project in ColdStream",
  description: "Updates an existing project with new parameters or data in ColdStream. [See the documentation](https://coldstream.readme.io/reference/put_projects-projectid)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    coldstream,
    projectId: {
      propDefinition: [
        coldstream,
        "asyncProjectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new name for the project",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The new description for the project",
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      description: this.description,
    };

    const response = await this.coldstream.updateProject({
      projectId: this.projectId,
      data,
    });

    $.export("$summary", `Successfully updated project with ID ${this.projectId}`);
    return response;
  },
};
