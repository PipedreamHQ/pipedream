import mural from "../../mural.app.mjs";

export default {
  key: "mural-create-mural",
  name: "Create Mural",
  description: "Create a new mural within a specified workspace.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mural,
    workspaceId: mural.propDefinitions.workspaceId,
    name: mural.propDefinitions.name,
    description: {
      ...mural.propDefinitions.description,
      optional: true,
    },
    templateId: {
      ...mural.propDefinitions.templateId,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mural.createMural({
      data: {
        workspaceId: this.workspaceId,
        name: this.name,
        description: this.description,
        templateId: this.templateId,
      },
    });
    $.export("$summary", `Successfully created mural ${this.name}`);
    return response;
  },
};
