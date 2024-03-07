import filestack from "../../filestack.app.mjs";

export default {
  key: "filestack-rotate-image",
  name: "Rotate Image",
  description: "Rotates an input image by a specified degree. [See the documentation](https://www.filestack.com/docs/api/processing/#rotate)",
  version: "0.0.1",
  type: "action",
  props: {
    filestack,
    imageSource: filestack.propDefinitions.imageSource,
    rotationDegree: filestack.propDefinitions.rotationDegree,
  },
  async run({ $ }) {
    const response = await this.filestack.transformImage({
      imageSource: this.imageSource,
      transformationType: "rotate",
      rotationDegree: this.rotationDegree,
    });
    $.export("$summary", `Image rotated ${this.rotationDegree} degrees successfully`);
    return response;
  },
};
