import flippingbook from "../../flippingbook.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "flippingbook-update-flipbook",
  name: "Update Flipbook",
  description: "Edits an existing flipbook by replacing it with a new input PDF file. [See the documentation](https://apidocs.flippingbook.com/#update-the-metadata-for-one-publication-possibly-attaching-a-new-source-file)",
  version: "0.0.1",
  type: "action",
  props: {
    flippingbook,
    flipbookId: {
      propDefinition: [
        flippingbook,
        "flipbookId",
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
    name: {
      propDefinition: [
        flippingbook,
        "name",
      ],
      optional: true,
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

    const response = await this.flippingbook.updateFlipbook({
      $,
      flipbookId: this.flipbookId,
      data,
    });

    if (!response.error) {
      $.export("$summary", `Successfully updated flipbook with ID: ${this.flipbookId}`);
    }
    return response;
  },
};
