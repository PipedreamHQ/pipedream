import documerge from "../../documerge.app.mjs";
import fs from "fs";

export default {
  key: "documerge-convert-file-to-pdf",
  name: "Convert File to PDF",
  description: "Converts a specified file into a PDF. [See the documentation](https://app.documerge.ai/api-docs/#tools-POSTapi-tools-pdf-convert)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    documerge,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new file",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the file to convert",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const fileContent = await this.documerge.convertToPdf({
      $,
      data: {
        file: {
          name: this.name,
          url: this.url,
        },
      },
    });

    const filename = this.name.includes(".pdf")
      ? this.name
      : `${this.name}.pdf`;
    const path = `/tmp/${filename}`;
    await fs.writeFileSync(path, Buffer.from(fileContent));

    $.export("$summary", "Successfully converted file to PDF");
    return path;
  },
};
