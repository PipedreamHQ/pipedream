import flippingbook from "../../flippingbook.app.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "flippingbook-create-flipbook",
  name: "Create Flipbook",
  description: "Generates a new flipbook from an input PDF file. [See the documentation](https://apidocs.flippingbook.com/#create-a-new-publication-possibly-attaching-a-new-source-file)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    async getFileData() {
      const stream = await getFileStream(this.filePath);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks).toString("base64");
    },
  },
  async run({ $ }) {
    const data = {
      filename: this.filename,
      name: this.name,
      description: this.description,
      data: await this.getFileData(),
    };

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
