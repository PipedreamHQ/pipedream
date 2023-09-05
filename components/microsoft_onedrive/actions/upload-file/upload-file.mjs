import onedrive from "../../microsoft_onedrive.app.mjs";
import httpRequest from "../../common/httpRequest.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";

export default {
  name: "Upload File",
  description: "Upload a file to OneDrive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_put_content?view=odsp-graph-online)",
  key: "microsoft_onedrive-upload-file",
  version: "0.0.1",
  type: "action",
  props: {
    onedrive,
    uploadFolderId: {
      propDefinition: [
        onedrive,
        "folder",
      ],
      label: "Upload Folder ID",
      description: "The ID of the folder where you want to upload the file.",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the image file saved to the `/tmp` directory (e.g. `/tmp/image.png`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    filename: {
      type: "string",
      label: "Name",
      description: "Name of the new uploaded file",
    },
  },
  methods: {
    httpRequest,
    uploadFile({
      uploadFolderId, filename, fileData, ...args
    }) {
      return this.httpRequest({
        url: `/items/${uploadFolderId}:/${encodeURI(filename)}:/content`,
        headers: {
          "Content-Type": "application/octet-stream",
        },
        data: fileData,
        method: "PUT",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadFolderId, filePath, filename,
    } = this;

    if (!uploadFolderId) {
      throw new ConfigurationError("You must specify the **Upload Folder ID**.");
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileData = fileBuffer.toString("base64");

    const response = await this.uploadFile({
      uploadFolderId,
      filename,
      fileData,
      $,
    });

    if (response?.id) {
      $.export("$summary", `Succressfully uploaded file with ID ${response.id}.`);
    }

    return response;
  },
};
