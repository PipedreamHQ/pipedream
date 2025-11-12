import customjs from "../../customjs.app.mjs";
import fs from "fs";
import { normalizeFilepath } from "../common/utils.mjs";

export default {
  key: "customjs-convert-html-to-png",
  name: "Convert HTML to PNG",
  description: "Converts an HTML string to a PNG image. [See the documentation](https://www.customjs.space/api/docs#_4-html-to-png)",
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
      description: "The HTML string to be converted to a PNG",
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
    const fileContent = await this.customjs.convertHtmlToPng({
      $,
      data: {
        input: this.html,
        code: "const { HTML2PNG } = require('./utils'); return HTML2PNG(input);",
        returnBinary: "true",
      },
    });

    const filepath = normalizeFilepath(this.filename, "png");
    fs.writeFileSync(filepath, Buffer.from(fileContent));

    $.export("$summary", "Successfully converted HTML to PNG");
    return {
      filename: this.filename,
      filepath,
    };
  },
};
