import flippingbook from "../../flippingbook.app.mjs";
import createFlipbook from "../create-flipbook/create-flipbook.mjs";

export default {
  key: "flippingbook-update-flipbook",
  name: "Update Flipbook",
  description: "Edits an existing flipbook by replacing it with a new input PDF file. [See the documentation](https://apidocs.flippingbook.com/#update-the-metadata-for-one-publication-possibly-attaching-a-new-source-file)",
  version: "1.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: createFlipbook.methods,
  async run({ $ }) {
    const data = {
      filename: this.filename,
      name: this.name,
      description: this.description,
      data: await this.getFileData(),
    };

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
