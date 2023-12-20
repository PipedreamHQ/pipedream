import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-create-video-template",
  name: "Create Video Template",
  description: "Generates a video from a selected template. [See the documentation](https://docs.heygen.com/reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    heygen,
    templateId: {
      propDefinition: [
        heygen,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.heygen.generateVideo(this.templateId);
    $.export("$summary", `Successfully generated video with template ID: ${this.templateId}`);
    return response;
  },
};
