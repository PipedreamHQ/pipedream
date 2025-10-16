import mime from "mime-types";
import app from "../../azure_storage.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "azure_storage-upload-blob",
  name: "Upload Blob",
  description: "Uploads a new blob to a specified container in Azure Storage. [See the documentation](https://learn.microsoft.com/en-us/rest/api/storageservices/put-blob?tabs=microsoft-entra-id).",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "In order to have the right permissions to use this feature you need to go to the Azure Console in `Storage Account > IAM > Add role assignment`, and add the special permissions for this type of request:\n - Storage Blob Data Contributor\n - Storage Queue Data Contributor\n [See the documentation](https://learn.microsoft.com/en-us/rest/api/storageservices/put-blob?tabs=microsoft-entra-id#permissions).",
    },
    containerName: {
      propDefinition: [
        app,
        "containerName",
      ],
    },
    blobName: {
      type: "string",
      label: "Blob Name",
      description: "The name of the blob within the specified container.",
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    uploadBlob({
      containerName, blobName, ...args
    } = {}) {
      return this.app.put({
        path: `/${containerName}/${blobName}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadBlob,
      containerName,
      blobName,
      filePath,
    } = this;

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(filePath);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks);
    const contentType = metadata.contentType || mime.lookup(metadata.name) || "application/octet-stream";

    await uploadBlob({
      $,
      containerName,
      blobName,
      data,
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": contentType,
        "x-ms-blob-content-disposition": `attachment; filename=${metadata.name}`,
        "x-ms-meta-m1": "v1",
        "x-ms-meta-m2": "v2",
        "Content-Length": data.length,
      },
    });

    $.export("$summary", "Successfully uploaded the blob.");
    return {
      success: true,
    };
  },
};
