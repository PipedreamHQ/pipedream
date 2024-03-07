import filestack from "../../filestack.app.mjs";

export default {
  key: "filestack-resize-image",
  name: "Resize Image",
  description: "Resizes an input image to specified width and height. [See the documentation](https://www.filestack.com/docs/api/processing/#resize)",
  version: "0.0.1",
  type: "action",
  props: {
    filestack,
    imageSource: filestack.propDefinitions.imageSource,
    width: filestack.propDefinitions.width,
    height: filestack.propDefinitions.height,
  },
  async run({ $ }) {
    if (!this.width || !this.height) {
      throw new Error("Width and Height are required for resizing the image.");
    }

    const transformationType = "resize";
    const response = await this.filestack.transformImage({
      imageSource: this.imageSource,
      transformationType,
      width: this.width,
      height: this.height,
    });

    $.export("$summary", `Image resized successfully to ${this.width}x${this.height}`);
    return response;
  },
};
