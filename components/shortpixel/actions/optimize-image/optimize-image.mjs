import shortpixel from "../../shortpixel.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "shortpixel-optimize-image",
  name: "Optimize Image",
  description: "Optimize and/or adjust an image using ShortPixel. [See the documentation](https://shortpixel.com/knowledge-base/article/shortpixel-adaptive-images-api-parameters/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shortpixel,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the image to optimize",
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width in pixels of the new image",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height in pixels of the new image",
      optional: true,
    },
    cropStyle: {
      type: "string",
      label: "Crop Style",
      description: "The crop style, useful when both width and height are specified",
      options: [
        "top",
        "right",
        "bottom",
        "left",
        "center",
      ],
      optional: true,
    },
    quality: {
      type: "string",
      label: "Quality",
      description: "The quality setting of the new image",
      options: [
        "lqip",
        "lossless",
        "glossy",
        "lossy",
      ],
      optional: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Optionally, enter a filename that will be used to save the image in /tmp",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
      optional: true,
    },
  },
  methods: {
    buildParams() {
      const paramArray = [
        "ret_wait ",
      ];
      if (this.width) {
        paramArray.push(`w_${this.width}`);
      }
      if (this.height) {
        paramArray.push(`h_${this.height}`);
      }
      if (this.cropStyle) {
        paramArray.push(`c_${this.cropStyle}`);
      }
      if (this.quality) {
        paramArray.push(`q_${this.quality}`);
      }
      return paramArray.join(",");
    },
    downloadFileToTmp(file, filePath) {
      const rawcontent = file.toString("base64");
      const buffer = Buffer.from(rawcontent, "base64");
      fs.writeFileSync(filePath, buffer);
    },
  },
  async run({ $ }) {
    if (!this.width && !this.height && !this.cropStyle && !this.quality) {
      throw new ConfigurationError("Must enter at least one of `width`, `height`, `cropStyle`, or `quality`");
    }

    const params = this.buildParams();

    let response = {
      url: `${this.shortpixel._baseUrl()}/client/${params}/${this.url}`,
    };

    try {
      const image = await this.shortpixel.optimizeImage({
        $,
        params,
        url: this.url,
        responseType: "arraybuffer",
      });
      if (this.filename) {
        const filePath = this.filename.includes("tmp/")
          ? this.filename
          : `/tmp/${this.filename}`;
        this.downloadFileToTmp(image, filePath);
        response.filePath = filePath;
      }
    } catch {
      throw new Error(`Unable to process image at URL: ${this.url}`);
    }

    return response;
  },
};
