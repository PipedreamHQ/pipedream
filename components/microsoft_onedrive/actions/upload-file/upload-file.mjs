import onedrive from "../../microsoft_onedrive.app.mjs";
import {
  ConfigurationError,
  getFileStreamAndMetadata,
} from "@pipedream/platform";

export default {
  name: "Upload File",
  description: "Upload a file to OneDrive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_put_content?view=odsp-graph-online)",
  key: "microsoft_onedrive-upload-file",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    filename: {
      type: "string",
      label: "Name",
      description: "Name of the new uploaded file",
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
      uploadFolderId, filePath, filename,
    } = this;

    if (!uploadFolderId) {
      throw new ConfigurationError("You must specify the **Upload Folder ID**.");
    }

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(filePath);
    const name = filename || metadata.name;

    const response = await this.onedrive.uploadFile({
      uploadFolderId,
      name,
      data: stream,
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully uploaded file with ID ${response.id}.`);
    }

    return response;
  },
};
