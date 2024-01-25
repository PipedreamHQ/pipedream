import agiled from "../../agiled.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agiled-create-project",
  name: "Create Project",
  description: "Creates a new project in the Agiled app. [See the documentation](https://my.agiled.app/developers)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agiled,
    projectTitle: {
      propDefinition: [
        agiled,
        "projectTitle",
      ],
    },
    projectDescription: {
      propDefinition: [
        agiled,
        "projectDescription",
      ],
    },
    dueDate: {
      propDefinition: [
        agiled,
        "dueDate",
        (c) => ({
          optional: true,
        }),
      ],
    },
    client: {
      propDefinition: [
        agiled,
        "client",
        (c) => ({
          optional: true,
        }),
      ],
    },
    assignedEmployees: {
      propDefinition: [
        agiled,
        "assignedEmployees",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.agiled.createProject({
      projectTitle: this.projectTitle,
      projectDescription: this.projectDescription,
      dueDate: this.dueDate,
      client: this.client,
      assignedEmployees: this.assignedEmployees
        ? this.assignedEmployees.map(JSON.parse)
        : [],
    });

    $.export("$summary", `Successfully created project '${this.projectTitle}'`);
    return response;
  },
};
