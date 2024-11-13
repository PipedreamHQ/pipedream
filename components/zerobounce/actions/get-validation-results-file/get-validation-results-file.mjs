import zerobounce from "../../zerobounce.app.mjs";
import fs from "fs";

export default {
  key: "zerobounce-get-validation-results-file",
  name: "Get Validation Results File",
  description: "Downloads the validation results for a file submitted using sendfile API. [See the documentation](https://www.zerobounce.net/docs/email-validation-api-quickstart/#get_file__v2__)",
  version: "0.0.1",
  type: "action",
  props: {
    zerobounce,
    fileId: {
      type: "string",
      label: "File ID",
      description: "The file_id returned when sending the file for validation",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The filename to save the file as in the \"/tmp\" directory",
    },
  },
  async run({ $ }) {
    const response = await this.zerobounce.getResultsFile({
      $,
      params: {
        file_id: this.fileId,
      },
      responseType: "arraybuffer",
    });

    const filePath = `/tmp/${this.fileName}`;
    fs.writeFileSync(filePath, response);

    $.export("$summary", `File saved to ${filePath}`);

    return filePath;
  },
};
