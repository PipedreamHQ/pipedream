import app from "../../akeneo.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";

export default {
  type: "action",
  key: "akeneo-create-a-new-product-media-file",
  version: "0.0.1",
  name: "Create A New Product Media File",
  description: "Allows you to create a new media file and associate it to an attribute value of a given product or product model. [See the docs](https://api.akeneo.com/api-reference.html#post_media_files)",
  props: {
    app,
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
    },
    productModelCode: {
      propDefinition: [
        app,
        "productModelCode",
      ],
    },
    mediaFileAttributeCode: {
      propDefinition: [
        app,
        "mediaFileAttributeCode",
      ],
    },
    filename: {
      type: "string",
      label: "File",
      description: "The file to be uploaded, please provide a file from `/tmp`. To upload a file to `/tmp` folder, please follow the doc [here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
  },
  async run ({ $ }) {
    if (!this.productId && !this.productModelCode) {
      throw new ConfigurationError("Either `Product Identifier` or `Product Model Code` should be set!");
    }
    const path = utils.checkTmp(this.filename);
    if (!fs.existsSync(path)) {
      throw new ConfigurationError("File does not exist!");
    }
    const payload = {
      attribute: this.mediaFileAttributeCode,
      scope: null,
      locale: null,
    };
    const data = new FormData();
    if (this.productId) {
      payload.identifier = this.productId;
      data.append("product", JSON.stringify(payload));
    } else {
      payload.code = this.productModelCode;
      data.append("product_model", JSON.stringify(payload));
    }
    const file = fs.readFileSync(path);
    const fileParts = path.split("/");
    data.append("file", file, fileParts[fileParts.length - 1]);
    const contentLength = data.getLengthSync();
    await this.app.createProductMediaFile({
      $,
      headers: {
        "Content-Length": contentLength,
        ...data.getHeaders(),
      },
      data,
    });
    $.export("$summary", "The product media file has been created.");
    return;
  },
};
