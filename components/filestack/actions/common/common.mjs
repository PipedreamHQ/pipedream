import filestack from "../../filestack.app.mjs";
import fs from "fs";

export default {
  props: {
    filestack,
    uploadedImageUrl: {
      propDefinition: [
        filestack,
        "uploadedImageUrl",
      ],
    },
    outputFilename: {
      propDefinition: [
        filestack,
        "outputFilename",
      ],
    },
  },
  methods: {
    getSummary() {
      return "Image transformed successfully";
    },
    getTransformations() {
      return "";
    },
  },
  async run({ $ }) {
    const {
      uploadedImageUrl, outputFilename,
    } = this;

    const response = await this.filestack.transformImage({
      $,
      uploadedImageUrl,
      transformations: this.getTransformations(),
    });

    $.export(
      "$summary",
      this.getSummary(),
    );

    if (outputFilename) {
      const filePath = outputFilename?.includes?.("tmp/")
        ? outputFilename
        : `/tmp/${outputFilename}`;

      await fs.promises.writeFile(filePath, Buffer.from(response));
      return filePath;
    }
    else return response;
  },
};
