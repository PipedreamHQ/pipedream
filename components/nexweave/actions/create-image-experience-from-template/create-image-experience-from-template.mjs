import nexweave from "../../nexweave.app.mjs";

export default {
  key: "nexweave-create-image-experience-from-template",
  name: "Create Image Experience from Template",
  description: "Creates an image experience based on a Nexweave template. [See the documentation](https://documentation.nexweave.com/nexweave-api)",
  version: "0.0.1",
  type: "action",
  props: {
    nexweave,
    templateId: {
      propDefinition: [
        nexweave,
        "templateId",
        () => ({
          type: "image",
        }),
      ],
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "The variables that you want to modify in the template.",
      async options({ templateId }) {
        if (!templateId) {
          throw new Error("Template ID is required to fetch the variables.");
        }
        const templateDetails = await this.nexweave.getTemplateDetails(templateId);
        return templateDetails.variables.map((variable) => ({
          label: variable.name,
          value: variable.key,
        }));
      },
    },
  },
  async run({ $ }) {
    const response = await this.nexweave.createTemplateExperience(this.templateId, this.variables, "image");
    $.export("$summary", `Successfully created image experience from template with ID ${this.templateId}`);
    return response;
  },
};
