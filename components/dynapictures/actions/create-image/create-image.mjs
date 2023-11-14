import dynapictures from "../../dynapictures.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dynapictures-create-image",
  name: "Create Image",
  description: "Generates a new image by using a given image as a template. [See the documentation](https://dynapictures.com/docs/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dynapictures,
    templateId: {
      propDefinition: [
        dynapictures,
        "templateId",
      ],
    },
    imageParams: {
      propDefinition: [
        dynapictures,
        "imageParams",
      ],
    },
  },
  async run({ $ }) {
    const imageParamsParsed = this.imageParams.map(JSON.parse);

    const response = await this.dynapictures.generateImage({
      templateId: this.templateId,
      imageParams: imageParamsParsed,
    });

    $.export("$summary", `Successfully generated image with template ID ${this.templateId}`);
    return response;
  },
};
