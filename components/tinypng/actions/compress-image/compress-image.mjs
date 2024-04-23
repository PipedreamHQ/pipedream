import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import { IMAGE_TYPES } from "../../common/constants.mjs";
import { checkTmp } from "../../common/utils.mjs";
import tinypng from "../../tinypng.app.mjs";

export default {
  key: "tinypng-compress-image",
  name: "Compress Image",
  description: "Compress a WebP, JPEG, or PNG image using the TinyPNG API. [See the documentation](https://tinypng.com/developers/reference#compressing-images)",
  version: "0.0.1",
  type: "action",
  props: {
    tinypng,
    url: {
      propDefinition: [
        tinypng,
        "url",
      ],
    },
    file: {
      propDefinition: [
        tinypng,
        "file",
      ],
    },
  },
  async run({ $ }) {
    if (!this.url && !this.file) {
      throw new Error("You must provide either a URL or a file for compression.");
    }

    let data;
    let headers = {};

    if (this.url) {
      data = {
        source: {
          url: this.url,
        },
      };
    }

    if (this.file) {
      const fileData = this.file.split(".");
      const ext = fileData[1];

      if (!IMAGE_TYPES.includes(ext)) {
        throw new ConfigurationError("You can upload either WebP, JPEG or PNG.");
      }
      const file = fs.readFileSync(checkTmp(this.file));
      data = file;
      headers = {
        "Content-Type": `image/${ext}`,
        "content-disposition": "attachment; filename=" + fileData[0],
      };

    }

    const response = await this.tinypng.compressImage({
      $,
      data,
      headers,
    });

    $.export("$summary", "Image processed successfully.");
    return response;
  },
};
