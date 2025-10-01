import nyckel from "../../nyckel.app.mjs";
import commonImage from "../../common/common-image.mjs";

export default {
  ...commonImage,
  key: "nyckel-extract-text-from-image",
  name: "Extract Text from Image",
  description: "Extracts text from an image URL. [See the documentation](https://www.nyckel.com/docs#ocr-image)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    includeRegions: {
      propDefinition: [
        nyckel,
        "includeRegions",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nyckel.extractTextFromImageUrl({
      $,
      functionId: this.functionId,
      ...(await this.getImageData()),
      params: {
        includeRegions: this.includeRegions,
      },
    });

    $.export("$summary", "Successfully extracted text from image");
    return response;
  },
};
