import mistralAI from "../../mistral_ai.app.mjs";
import fs from "fs";

export default {
  key: "mistral_ai-download-batch-job-results",
  name: "Download Batch Job Results",
  description: "Download a batch job results file to the /tmp directory. [See the Documentation](https://docs.mistral.ai/api/#tag/files/operation/files_api_routes_download_file)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mistralAI,
    fileId: {
      propDefinition: [
        mistralAI,
        "fileIds",
        () => ({
          sampleType: "batch_result",
        }),
      ],
      type: "string",
      label: "File ID",
      description: "The identifier of a batch result file to download",
    },
    filename: {
      type: "string",
      label: "File Name",
      description: "The filename to save the results file in the /tmp directory",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.mistralAI.downloadFile({
      $,
      fileId: this.fileId,
      responseType: "arraybuffer",
    });

    const buffer = Buffer.isBuffer(response)
      ? response
      : Buffer.from(response);
    const filename = this.filename;
    const filePath = `/tmp/${filename}`;
    fs.writeFileSync(filePath, buffer);

    $.export("$summary", "Successfully downloaded batch results file");

    return [
      filename,
      filePath,
    ];
  },
};
