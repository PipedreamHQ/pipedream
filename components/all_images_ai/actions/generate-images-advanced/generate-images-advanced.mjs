import allImagesAi from "../../all_images_ai.app.mjs";

export default {
  key: "all_images_ai-generate-images-advanced",
  name: "Generate Advanced Customized Images",
  description: "Generates advanced customized images using a prompt from the user.",
  version: "0.0.1",
  type: "action",
  props: {
    allImagesAi,
    name: allImagesAi.propDefinitions.name,
    mode: allImagesAi.propDefinitions.mode,
    prompt: allImagesAi.propDefinitions.prompt,
  },
  async run({ $ }) {
    const response = await this.allImagesAi.generateImage({
      name: this.name,
      mode: this.mode,
      prompt: this.prompt,
    });
    $.export("$summary", `Successfully generated images with the name "${this.name}"`);
    return response;
  },
};
