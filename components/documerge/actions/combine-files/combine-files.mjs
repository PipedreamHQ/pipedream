import documerge from "../../documerge.app.mjs";
import fs from "fs";

export default {
  key: "documerge-combine-files",
  name: "Combine Files",
  description: "Merges multiple user-specified files into a single PDF or DOCX. [See the documentation](https://app.documerge.ai/api-docs/#tools-POSTapi-tools-combine)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    documerge,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new file",
    },
    output: {
      type: "string",
      label: "Output",
      description: "The output file type",
      options: [
        "pdf",
        "docx",
      ],
    },
    urls: {
      type: "string[]",
      label: "URLs",
      description: "Array of URLs to combine",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const fileContent = await this.documerge.combineFiles({
      $,
      data: {
        output: this.output,
        files: this.urls.map((url) => ({
          name: this.name,
          url,
        })),
      },
    });

    const filename = this.name.includes(".pdf") || this.name.includes(".docx")
      ? this.name
      : `${this.name}.${this.output}`;
    const path = `/tmp/${filename}`;
    await fs.writeFileSync(path, Buffer.from(fileContent));

    $.export("$summary", "Successfully combined files");
    return path;
  },
};
