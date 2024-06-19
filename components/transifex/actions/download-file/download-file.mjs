import transifex from "../../transifex.app.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";
import path from "path";

export default {
  key: "transifex-download-file",
  name: "Download File",
  description: "Downloads a user-specified file from the Transifex platform. [See the documentation](https://developers.transifex.com/reference/get_resource-strings-async-downloads-resource-strings-async-download-id)",
  version: "0.0.{{ts}}",
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
      asyncDownloadId: this.asyncDownloadId,
    });

    const filePath = path.join("/tmp", `downloaded_file_${this.asyncDownloadId}.zip`);
    fs.writeFileSync(filePath, response);

    $.export("$summary", `Successfully downloaded file with asyncDownloadId: ${this.asyncDownloadId}`);
    return {
      filePath,
    };
  },
};
