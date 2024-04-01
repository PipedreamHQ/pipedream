import nyckel from "../../nyckel.app.mjs";
import commonImage from "../../common/common-image.mjs";

export default {
  ...commonImage,
  key: "nyckel-classify-image",
  name: "Classify Image",
  description: "Classifies image data based on pre-trained classifiers in Nyckel. [See the documentation](https://www.nyckel.com/docs#invoke-image)",
  version: "0.0.1",
  type: "action",
  props: {
    nyckel,
    functionId: {
      propDefinition: [
        nyckel,
        "functionId",
      ],
    },
    ...commonImage.props,
    imageData: {
      ...nyckel.propDefinitions.imageData,
      optional: true,
    },
    classifications: nyckel.propDefinitions.classifications,
  },
  async run({ $ }) {
    if (!this.imageUrl && !this.imageData) {
      throw new Error("You must provide either an Image URL or Image Data.");
    }

    let response;
    if (this.imageUrl) {
      response = await this.nyckel.classifyImageData({
        functionId: this.functionId,
        imageUrl: this.imageUrl,
        classifications: this.classifications,
      });
    } else if (this.imageData) {
      response = await this.nyckel.classifyImageData({
        functionId: this.functionId,
        imageData: this.imageData,
        classifications: this.classifications,
      });
    }

    $.export("$summary", "Image classification completed successfully");
    return response;
  },
};
