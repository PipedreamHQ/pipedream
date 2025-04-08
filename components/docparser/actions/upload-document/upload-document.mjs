import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import docparser from "../../docparser.app.mjs";

export default {
  key: "docparser-upload-document",
  name: "Upload Document",
  description: "Uploads a document to docparser that initiates parsing immediately after reception. [See the documentation](https://docparser.com/api/#import-documents)",
  version: "0.0.1",
  type: "action",
  props: {
    docparser,
    parserId: {
      propDefinition: [
        docparser,
        "parserId",
      ],
    },
    file: {
      type: "string",
      label: "File",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
  },
  async run({ $ }) {
    const data = new FormData();
    data.append("file", fs.createReadStream(checkTmp(this.file)));

    const response = await this.docparser.uploadDocument({
      $,
      parserId: this.parserId,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Successfully uploaded document. Document ID: ${response.id}`);
    return response;
  },
};
