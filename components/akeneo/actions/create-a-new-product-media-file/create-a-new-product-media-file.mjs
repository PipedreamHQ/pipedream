import app from "../../akeneo.app.mjs";
import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";

export default {
  type: "action",
  key: "akeneo-create-a-new-product-media-file",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create A New Product Media File",
  description: "Allows you to create a new media file and associate it to an attribute value of a given product or product model. [See the docs](https://api.akeneo.com/api-reference.html#post_media_files)",
  props: {
    app,
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
      optional: true,
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
      label: "File Path or URL",
      description: "The file to be uploaded. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run ({ $ }) {
    if (!this.productId && !this.productModelCode) {
      throw new ConfigurationError("Either `Product Identifier` or `Product Model Code` should be set!");
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

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filename);
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
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
