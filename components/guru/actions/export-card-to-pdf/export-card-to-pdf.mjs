import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import guru from "../../guru.app.mjs";

export default {
  key: "guru-export-card-to-pdf",
  name: "Export Card to PDF",
  description: "Export a specific card identified by its ID to a PDF file. [See the documentation](https://developer.getguru.com/docs/download-cards-to-pdf)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    guru,
    cardId: {
      propDefinition: [
        guru,
        "cardId",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      headers, data,
    } = await this.guru.exportCardToPdf({
      $,
      cardId: this.cardId,
      returnFullResponse: true,
    });

    const fileName = headers["content-disposition"]?.split("filename=")[1]?.split("/")[1].slice(0, -1);
    const filePath = `/tmp/${fileName}`;

    const pipeline = promisify(stream.pipeline);
    await pipeline(data, fs.createWriteStream(filePath));

    $.export("$summary", `Successfully exported card ID ${this.cardId} to PDF.`);
    return {
      filePath,
    };
  },
};
