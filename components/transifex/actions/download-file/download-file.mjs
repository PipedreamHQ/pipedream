import fs from "fs";
import transifex from "../../transifex.app.mjs";

export default {
  key: "transifex-download-file",
  name: "Download File",
  description: "Downloads a user-specified file from the Transifex platform. [See the documentation](https://developers.transifex.com/reference/get_resource-strings-async-downloads-resource-strings-async-download-id)",
  version: "0.0.1",
  type: "action",
  props: {
    transifex,
    asyncDownloadId: {
      propDefinition: [
        transifex,
        "asyncDownloadId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.transifex.downloadFile({
      $,
      asyncDownloadId: this.asyncDownloadId,
    });

    const file = response.toString("base64");
    const buffer = Buffer.from(file, "base64");
    const tmpDir = "/tmp";
    const filePath = `${tmpDir}/downloaded_file_${this.asyncDownloadId}.json`;
    fs.writeFileSync(filePath, buffer);

    $.export("$summary", `Successfully downloaded file with asyncDownloadId: ${this.asyncDownloadId}`);
    return {
      filePath,
    };
  },
};
