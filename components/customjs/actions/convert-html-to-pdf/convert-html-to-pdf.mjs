import customjs from "../../customjs.app.mjs";
import fs from "fs";
import { normalizeFilepath } from "../common/utils.mjs";

export default {
  key: "customjs-convert-html-to-pdf",
  name: "Convert HTML to PDF",
  description: "Converts an HTML string to a PDF document. [See the documentation](https://www.customjs.space/api/docs#_1-html-to-pdf)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    customjs,
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML string to be converted to a PDF",
    },
    filename: {
      propDefinition: [
        customjs,
        "filename",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const fileContent = await this.customjs.convertHtmlToPdf({
      $,
      data: {
        input: this.html,
        code: "const { HTML2PDF } = require(\"./utils\"); return HTML2PDF(input);",
        returnBinary: "true",
      },
    });

    const filepath = normalizeFilepath(this.filename);
    fs.writeFileSync(filepath, Buffer.from(fileContent));

    $.export("$summary", "Successfully converted HTML to PDF");
    return {
      filename: this.filename,
      filepath,
    };
  },
};
