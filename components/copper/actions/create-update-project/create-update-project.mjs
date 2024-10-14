import copper from "../../copper.app.mjs";

export default {
  key: "copper-create-update-project",
  name: "Create or Update Project",
  description: "Creates a new project or updates an existing one based on the matching criteria. [See the documentation](https://developer.copper.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    copper,
    projectData: {
      propDefinition: [
        copper,
        "projectData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.copper.createOrUpdateProject(this.projectData);
    $.export("$summary", `Successfully created or updated project ${this.projectData.name}`);
    return response;
  },
};
