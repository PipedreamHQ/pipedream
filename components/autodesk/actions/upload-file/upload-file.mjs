import autodesk from "../../autodesk.app.mjs";
import fs from "fs";

export default {
  key: "autodesk-upload-file",
  name: "Upload File",
  description: "Uploads a new file to a specified folder in Autodesk. [See the documentation](https://aps.autodesk.com/en/docs/data/v2/tutorials/upload-file/).",
  version: "0.0.1",
  type: "action",
  props: {
    autodesk,
    hubId: {
      propDefinition: [
        autodesk,
        "hubId",
      ],
    },
    projectId: {
      propDefinition: [
        autodesk,
        "projectId",
        (c) => ({
          hubId: c.hubId,
        }),
      ],
    },
    folderId: {
      propDefinition: [
        autodesk,
        "folderId",
        (c) => ({
          hubId: c.hubId,
          projectId: c.projectId,
        }),
      ],
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file to upload",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
  },
  async run({ $ }) {
    // Create storage location
    const { data } = await this.autodesk.createStorageLocation({
      $,
      projectId: this.projectId,
      data: {
        jsonapi: {
          version: "1.0",
        },
        data: {
          type: "objects",
          attributes: {
            name: this.fileName,
          },
          relationships: {
            target: {
              data: {
                type: "folders",
                id: this.folderId,
              },
            },
          },
        },
      },
    });

    const objectId = data.id;
    const [
      bucketKey,
      objectKey,
    ] = objectId.match(/^urn:adsk\.objects:os\.object:([^/]+)\/(.+)$/);

    // Generate signed URL
    const {
      urls, uploadKey,
    } = await this.autodesk.generateSignedUrl({
      $,
      bucketKey,
      objectKey,
    });

    const signedUrl = urls[0];

    // Upload to signed URL
    const fileStream = fs.createReadStream(this.filePath.includes("tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`);

    await this.autodesk._makeRequest({
      $,
      url: signedUrl,
      data: fileStream,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    // Complete the upload
    const response = await this.autodesk.completeUpload({
      $,
      bucketKey,
      objectKey,
      data: {
        uploadKey,
      },
    });

    $.export("$summary", `Successfully uploaded file ${this.fileName}`);
    return response;
  },
};
