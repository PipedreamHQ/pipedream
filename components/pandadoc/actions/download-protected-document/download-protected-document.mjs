import app from "../../pandadoc.app.mjs";
import fs from "fs";

export default {
  key: "pandadoc-download-protected-document",
  name: "Download Protected Document",
  description:
    "Download a completed document as a verifiable PDF. [See documentation here](https://developers.pandadoc.com/reference/download-protected-document)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "completedDocumentId",
      ],
    },
    outputFilename: {
      propDefinition: [
        app,
        "outputFilename",
      ],
    },
    separateFiles: {
      propDefinition: [
        app,
        "separateFiles",
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
      outputFilename, id,
    } = this;
    const data = await this.app.downloadProtectedDocument({
      $,
      id,
      params: {
        separate_files: this.separateFiles,
      },
    });

    const filePath = `/tmp/${outputFilename}`;
    fs.writeFileSync(filePath, data);
    $.export("$summary", `Successfully downloaded protected document "${outputFilename}"`);

    return {
      filePath,
    };
  },
};
