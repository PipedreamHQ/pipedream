import zerobounce from "../../zerobounce.app.mjs";
import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "zerobounce-get-validation-results-file",
  name: "Get Validation Results File",
  description: "Downloads the validation results for a file submitted using sendfile API. [See the documentation](https://www.zerobounce.net/docs/email-validation-api-quickstart/#get_file__v2__)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zerobounce,
    fileId: {
      type: "string",
      label: "File ID",
      description: "The file_id returned when sending the file for validation. Can be found on your Zerobounce \"Validate\" tab under Results next to each filename. Click on the ID circle.",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The filename to save the file as in the \"/tmp\" directory",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    getResultsFile({
      $, ...opts
    }) {
      return this.zerobounce.getResultsFile({
        $,
        params: {
          file_id: this.fileId,
        },
        ...opts,
      });
    },
    async validateFileId({ $ }) {
      try {
        return await this.getResultsFile({
          $,
        });
      } catch {
        throw new ConfigurationError("File not found. Make sure the File ID is correct");
      }
    },
  },
  async run({ $ }) {
    if (!(await this.validateFileId({
      $,
    }))) {
      return;
    }
    const response = await this.getResultsFile({
      $,
      responseType: "arraybuffer",
    });

    const filePath = `/tmp/${this.fileName}`;
    fs.writeFileSync(filePath, response);

    $.export("$summary", `File saved to ${filePath}`);

    return filePath;
  },
};
