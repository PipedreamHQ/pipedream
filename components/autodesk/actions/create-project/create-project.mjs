import autodesk from "../../autodesk.app.mjs";

export default {
  key: "autodesk-create-project",
  name: "Create Project",
  description: "Creates a new project in Autodesk. [See the documentation](https://aps.autodesk.com/developer/documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    autodesk,
    projectName: {
      propDefinition: [
        autodesk,
        "projectName",
      ],
    },
    projectDescription: {
      propDefinition: [
        autodesk,
        "projectDescription",
      ],
    },
    targetWorkspaceId: {
      propDefinition: [
        autodesk,
        "targetWorkspaceId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const project = await this.autodesk.createProject();
    $.export("$summary", `Created project ${project.name} (ID: ${project.id})`);
    return project;
  },
};
