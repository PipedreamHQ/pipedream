import onedrive from "../../microsoft_onedrive.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import { fileTypeFromBuffer } from "file-type";

export default {
  name: "Upload File",
  description: "Upload a file to OneDrive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_put_content?view=odsp-graph-online)",
  key: "microsoft_onedrive-upload-file",
  version: "0.1.1",
  type: "action",
  props: {
    onedrive,
    uploadFolderId: {
      propDefinition: [
        onedrive,
        "folder",
      ],
      label: "Upload Folder ID",
      description: "The ID of the folder where you want to upload the file. Use the \"Load More\" button to load subfolders.",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file saved to the `/tmp` directory (e.g. `/tmp/image.png`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    filename: {
      type: "string",
      label: "Name",
      description: "Name of the new uploaded file",
    },
  },
  async run({ $ }) {
    const {
      uploadFolderId, filePath, filename,
    } = this;

    if (!uploadFolderId) {
      throw new ConfigurationError("You must specify the **Upload Folder ID**.");
    }

    const data = fs.readFileSync(filePath);
    let name = filename;
    if (!filename.includes(".")) {
      const fileType = await fileTypeFromBuffer(data);
      const extension = fileType?.ext || "";
      name = `${filename}.${extension}`;
    }

    const response = await this.onedrive.uploadFile({
      uploadFolderId,
      name,
      data,
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully uploaded file with ID ${response.id}.`);
    }

    return response;
  },
};
