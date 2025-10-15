import nyckel from "../../nyckel.app.mjs";
import commonImage from "../../common/common-image.mjs";

export default {
  ...commonImage,
  key: "nyckel-classify-image",
  name: "Classify Image",
  description: "Classifies image data based on pre-trained classifiers in Nyckel. [See the documentation](https://www.nyckel.com/docs#invoke-image)",
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
    labelCount: {
      propDefinition: [
        nyckel,
        "labelCount",
      ],
    },
    includeMetadata: {
      propDefinition: [
        nyckel,
        "includeMetadata",
      ],
    },
    capture: {
      propDefinition: [
        nyckel,
        "capture",
      ],
    },
    externalId: {
      propDefinition: [
        nyckel,
        "externalId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nyckel.invokeFunction({
      $,
      functionId: this.functionId,
      ...(await this.getImageData()),
      params: {
        labelCount: this.labelCount,
        includeMetadata: this.includeMetadata,
        capture: this.capture,
        externalId: this.externalId,
      },
    });

    $.export("$summary", "Image classification completed successfully");
    return response;
  },
};
