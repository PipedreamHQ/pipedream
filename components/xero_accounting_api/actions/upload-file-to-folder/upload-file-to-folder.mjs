import xeroAccountingApi from "../../xero_accounting_api.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "xero_accounting_api-upload-file-to-folder",
  name: "Upload File to Folder",
  description: "Upload a file to a folder. [See the documentation](https://developer.xero.com/documentation/api/files/files#post-files)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    xeroAccountingApi,
    filePathOrUrl: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    folderId: {
      propDefinition: [
        xeroAccountingApi,
        "folderId",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePathOrUrl);

    const data = new FormData();
    data.append("Xero", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.xeroAccountingApi.uploadFileToFolder({
      $,
      folderId: this.folderId,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Successfully uploaded file to folder with ID: ${this.folderId}`);
    return response;
  },
};
