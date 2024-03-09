import app from "../../filestack.app.mjs";
import fs from "fs";

export default {
  props: {
    app,
    propDefinition: [
      app,
      "fileOrUrl",
    ],
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
            "Content-Type": "application/json",
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
};
