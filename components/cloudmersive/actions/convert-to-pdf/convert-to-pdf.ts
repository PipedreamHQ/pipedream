import fs from "fs";
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import cloudmersive from "../../app/cloudmersive.app";
import { DOCS } from "../../common/constants";
import { ConvertToPDFParams } from "../../common/types";

export default defineAction({
  name: "Convert to PDF",
  description: `Convert Office Word Documents (docx) to PDF [See docs here](${DOCS.convertToPDF})`,
  key: "cloudmersive-convert-to-pdf",
  version: "0.0.1",
  type: "action",
  props: {
    cloudmersive,
    filePath: {
      type: "string",
      label: "File Path",
      description:
        `Path to the input .docx file, such as \`/tmp/file.docx\`. [See the docs on working with files](${DOCS.pdFilesTutorial})`,
    },
  },
  async run({ $ }) {
    const { filePath } = this;
    let file: Buffer;
    try {
      file = await fs.promises.readFile(filePath);
    } catch (err) {
      throw new ConfigurationError(
        `**Error when reading file** - check the file path and try again.
        ${err}`,
      );
    }
    const params: ConvertToPDFParams = {
      $,
      file,
    };

    const response = await this.cloudmersive.convertToPDF(params);

    $.export("$summary", `Converted file "${filePath}"`);

    return response;
  },
});
