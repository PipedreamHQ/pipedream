import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import sailpoint from "../../sailpoint.app.mjs";

export default {
  key: "sailpoint-upload-account-source-file",
  name: "Upload Account Source File",
  description: "Uploads a CSV-formatted account source file to IdentityNow. [See the documentation]()",
  version: "0.0.1",
  type: "action",
  props: {
    sailpoint,
    sourceId: {
      propDefinition: [
        sailpoint,
        "sourceId",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
  },
  async run({ $ }) {
    const data = new FormData();

    data.append("file", fs.createReadStream(checkTmp(this.filePath)));

    const response = await this.sailpoint.uploadSourceAccountFile({
      $,
      sourceId: this.sourceId,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Successfully uploaded file for source account: ${response.id} (${response.name})`);
    return response;
  },
};
