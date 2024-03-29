import nyckel from "../../nyckel.app.mjs";

export default {
  key: "nyckel-extract-text-from-image",
  name: "Extract Text from Image",
  description: "Extracts text from an image URL. [See the documentation](https://www.nyckel.com/docs#ocr)",
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
    imageUrl: {
      propDefinition: [
        nyckel,
        "imageUrl",
      ],
    },
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
      data: {
        data: this.imageUrl,
      },
      params: {
        includeRegions: this.includeRegions,
      },
    });

    $.export("$summary", "Successfully extracted text from the image");
    return response;
  },
};
