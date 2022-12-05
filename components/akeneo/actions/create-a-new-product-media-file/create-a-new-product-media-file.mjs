import app from "../../akeneo.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";

export default {
  type: "action",
  key: "akeneo-create-a-new-product-media-file",
  version: "0.0.53",
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
    attributeCode: {
      propDefinition: [
        app,
        "attributeCode",
      ],
    },
    channelCode: {
      propDefinition: [
        app,
        "channelCode",
      ],
    },
    localeCode: {
      propDefinition: [
        app,
        "localeCode",
        (configuredProps) => ({
          channelCode: configuredProps.channelCode,
        }),
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
      attribute: this.attributeCode,
      scope: this.channelCode,
      locale: this.localeCode,
    };
    const data = new FormData();
    if (this.productId) {
      payload.identifier = this.productId;
      data.append("product", JSON.stringify(payload));
    } else {
      payload.code = this.productModelCode;
      data.append("product_model", JSON.stringify(payload));
    }
    const file = fs.createReadStream(path);
    //const file = fs.readFileSync(path);
    const stats = fs.statSync(path);
    data.append("file", file/*, {
      knownLength: stats.size,
    }*/);
    const resp = await this.app.createProductMediaFile({
      $,
      headers: {
        //"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        "Content-Type": "multipart/form-data",
      },
      data,
    });
    $.export("$summary", "The product media file has been created.");
    return resp;
  },
};
