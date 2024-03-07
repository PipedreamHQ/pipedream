import filestack from "../../filestack.app.mjs";

export default {
  key: "filestack-filter-image",
  name: "Filter Image",
  description: "Applies transformative effects such as sharpening, blurring, sepia, monochrome, and more, to an input image. The user needs to configure the image source and transformation props.",
  version: "0.0.1",
  type: "action",
  props: {
    filestack,
    imageSource: filestack.propDefinitions.imageSource,
    transformationType: filestack.propDefinitions.transformationType,
    width: filestack.propDefinitions.width,
    height: filestack.propDefinitions.height,
    rotationDegree: filestack.propDefinitions.rotationDegree,
    blurAmount: filestack.propDefinitions.blurAmount,
    sharpenAmount: filestack.propDefinitions.sharpenAmount,
  },
  async run({ $ }) {
    const response = await this.filestack.transformImage({
      imageSource: this.imageSource,
      transformationType: this.transformationType,
      rotationDegree: this.rotationDegree,
      width: this.width,
      height: this.height,
      blurAmount: this.blurAmount,
      sharpenAmount: this.sharpenAmount,
    });

    $.export("$summary", `Successfully applied ${this.transformationType} transformation to the image.`);
    return response;
  },
};
