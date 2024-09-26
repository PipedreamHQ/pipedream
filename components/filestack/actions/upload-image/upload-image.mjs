import filestack from "../../filestack.app.mjs";
import fs from "fs";

export default {
  key: "filestack-upload-image",
  name: "Upload Image",
  description:
    "Upload an image from a file or URL to FileStack. [See the documentation](https://www.filestack.com/docs/uploads/uploading/#upload-file)",
  version: "0.0.1",
  type: "action",
  props: {
    filestack,
    fileOrUrl: {
      propDefinition: [
        filestack,
        "fileOrUrl",
      ],
    },
  },
  methods: {
    getImageMimeType(path) {
      const ext = path.split(".").pop();
      switch (ext) {
      case "jpg":
        return "jpeg";
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
      case "webp":
      case "tiff":
        return ext;
      case "svg":
        return "svg+xml";
      default:
        return "*";
      }
    },
    async getImageData() {
      const { fileOrUrl } = this;
      const isUrl = fileOrUrl.startsWith("http");
      return isUrl
        ? {
          data: {
            url: fileOrUrl,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
        : {
          data: fs.createReadStream(
            fileOrUrl.includes("tmp/")
              ? fileOrUrl
              : `/tmp/${fileOrUrl}`,
          ),
          headers: {
            "Content-Type": `image/${this.getImageMimeType(fileOrUrl)}`,
          },
        };
    },
  },
  async run({ $ }) {
    const args = await this.getImageData();

    const response = await this.filestack.uploadImage({
      $,
      ...args,
    });

    $.export(
      "$summary",
      "Successfully uploaded image",
    );
    return response;
  },
};
