import airparser from "../../airparser.app.mjs";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "airparser-upload-document-parse",
  name: "Upload Document and Parse",
  description: "Uploads a document into the inbox for data extraction. [See the documentation](https://help.airparser.com/public-api/public-api)",
  version: "0.0.1",
  type: "action",
  props: {
    airparser,
    inboxId: {
      propDefinition: [
        airparser,
        "inboxId",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "The user-defined extraction schema for data extraction",
      optional: true,
    },
  },
  async run({ $ }) {
    const fileStream = fs.createReadStream(this.filePath.includes("tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`);
    const data = new FormData();
    data.append("file", fileStream);
    if (this.metadata) {
      data.append("meta", JSON.stringify(this.metadata));
    }

    const response = await this.airparser.uploadDocument({
      $,
      inboxId: this.inboxId,
      data,
    });
    $.export("$summary", `Successfully uploaded document with ID ${response}`);
    return response;
  },
};
