import sharepoint from "../../sharepoint.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "sharepoint-upload-file",
  name: "Upload File",
  description: "Upload a file to OneDrive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_put_content?view=odsp-graph-online)",
  version: "0.0.6",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
    },
    driveId: {
      propDefinition: [
        sharepoint,
        "driveId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    uploadFolderId: {
      propDefinition: [
        sharepoint,
        "folderId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
        }),
      ],
      label: "Upload Folder ID",
      description: "The ID of the folder where you want to upload the file. You can either search for the folder here or provide a custom *Folder ID*.",
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
      siteId, driveId, uploadFolderId, filePath, filename,
    } = this;

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(filePath);
    const name = filename || metadata.name;

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const response = await this.sharepoint.uploadFile({
      siteId,
      driveId,
      uploadFolderId,
      name,
      data: buffer,
    });

    if (response?.id) {
      $.export("$summary", `Successfully uploaded file with ID ${response.id}.`);
    }

    return response;
  },
};
