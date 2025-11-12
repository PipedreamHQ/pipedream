import autodesk from "../../autodesk.app.mjs";
import {
  axios, getFileStreamAndMetadata,
} from "@pipedream/platform";

export default {
  key: "autodesk-upload-file",
  name: "Upload File",
  description: "Uploads a new file to a specified folder in Autodesk. [See the documentation](https://aps.autodesk.com/en/docs/data/v2/tutorials/upload-file/).",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    type: {
      type: "string",
      label: "Extension Type",
      description: "The type of file extension. For BIM 360 Docs files, use `items:autodesk.bim360:File`. For all other services, use `items:autodesk.core:File`.",
      options: [
        {
          label: "BIM 360 Docs files",
          value: "items:autodesk.core:File",
        },
        {
          label: "Other files",
          value: "items:autodesk.bim360:File",
        },
      ],
      default: "items:autodesk.core:File",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
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
    ] = objectId.split("os.object:")[1]?.split("/") || [];

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
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);

    await axios($, {
      url: signedUrl,
      data: stream,
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": metadata.size,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // Complete the upload
    await this.autodesk.completeUpload({
      $,
      bucketKey,
      objectKey,
      data: {
        uploadKey,
      },
    });

    // Create version 1.0 of uploaded file
    const response = await this.autodesk.createFirstVersionOfFile({
      $,
      projectId: this.projectId,
      data: {
        jsonapi: {
          version: "1.0",
        },
        data: {
          type: "items",
          attributes: {
            displayName: this.fileName,
            extension: {
              type: this.type,
              version: "1.0",
            },
          },
          relationships: {
            tip: {
              data: {
                type: "versions",
                id: "1",
              },
            },
            parent: {
              data: {
                type: "folders",
                id: this.folderId,
              },
            },
          },
        },
        included: [
          {
            type: "versions",
            id: "1",
            attributes: {
              name: this.fileName,
              extension: {
                type: this.type.replace("items", "versions"),
                version: "1.0",
              },
            },
            relationships: {
              storage: {
                data: {
                  type: "objects",
                  id: objectId,
                },
              },
            },
          },
        ],
      },
    });

    $.export("$summary", `Successfully uploaded file ${this.fileName}`);
    return response;
  },
};
