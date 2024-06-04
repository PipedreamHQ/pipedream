import flippingbook from "../../flippingbook.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "flippingbook-create-flipbook",
  name: "Create Flipbook",
  description: "Generates a new flipbook from an input PDF file. [See the documentation](https://apidocs.flippingbook.com/#create-a-new-publication-possibly-attaching-a-new-source-file)",
  version: "0.0.1",
  type: "action",
  props: {
    flippingbook,
    name: {
      propDefinition: [
        flippingbook,
        "name",
      ],
    },
    info: {
      propDefinition: [
        flippingbook,
        "info",
      ],
    },
    fileUrl: {
      propDefinition: [
        flippingbook,
        "fileUrl",
      ],
    },
    filePath: {
      propDefinition: [
        flippingbook,
        "filePath",
      ],
    },
    filename: {
      propDefinition: [
        flippingbook,
        "filename",
      ],
    },
    description: {
      propDefinition: [
        flippingbook,
        "description",
      ],
    },
  },
  async run({ $ }) {
    if ((!this.fileUrl && !this.filePath) || (this.fileUrl && this.filePath)) {
      throw new ConfigurationError("Please provide exactly one of File URL or File Path");
    }
    const data = {
      filename: this.filename,
      name: this.name,
      description: this.description,
    };
    if (this.fileUrl) {
      data.url = this.fileUrl;
    } else {
      const content = fs.readFileSync(this.filePath.includes("tmp/")
        ? this.filePath
        : `/tmp/${this.filePath}`);
      data.data = content.toString("base64");
    }

    const response = await this.flippingbook.createFlipbook({
      $,
      data,
    });

    if (!response.error) {
      $.export("$summary", `Successfully created flipbook with ID: ${response.id}`);
    }
    return response;
  },
};
