import nexweave from "../../nexweave.app.mjs";

export default {
  key: "nexweave-create-video-experience-from-template",
  name: "Create Video Experience from Template",
  description: "Creates a video experience from a Nexweave video template. [See the documentation](https://documentation.nexweave.com/nexweave-api)",
  version: "0.0.1",
  type: "action",
  props: {
    nexweave,
    templateId: {
      propDefinition: [
        nexweave,
        "templateId",
        () => ({
          type: "video",
        }),
      ],
    },
    variables: {
      type: "string[]",
      label: "Variables",
      description: "An array of objects representing the variables for the template. Each item should be a JSON string.",
    },
  },
  async run({ $ }) {
    const parsedVariables = this.variables.map(JSON.parse);
    const response = await this.nexweave.createTemplateExperience(this.templateId, parsedVariables, "video");
    $.export("$summary", `Successfully created a video experience from the template with ID: ${this.templateId}`);
    return response;
  },
};
