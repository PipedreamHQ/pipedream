import copper from "../../copper.app.mjs";

export default {
  key: "copper-associate-to-project",
  name: "Associate to Project",
  description: "Relates an existing project with an existing CRM object. Assumes the project and CRM object already exist.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    copper,
    crmId: {
      propDefinition: [
        copper,
        "crmId",
      ],
    },
    projectId: {
      propDefinition: [
        copper,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.copper.relateProjectToCrm(this.crmId, this.projectId);
    $.export("$summary", `Successfully associated Project ID ${this.projectId} with CRM ID ${this.crmId}`);
    return response;
  },
};
