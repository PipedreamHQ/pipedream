import app from "../../box.app.mjs";
import { getFileUploadBody } from "../../common/common-file-upload.mjs";

export default {
  name: "Upload File Version",
  description: "Uploads a new version of an existing Box file (max 50MB), replacing its current content; prior versions are kept in version history on premium accounts. Optionally rename the file at the same time. Use **List File Versions** to review version history afterward. [See the documentation](https://developer.box.com/reference/post-files-id-content/).",
  key: "box-upload-file-version",
  version: "0.1.9",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "The folder containing the file to update. Use `0` for the root folder. Use the **List Folders** action to retrieve folder IDs.",
      optional: false,
    },
    fileId: {
      propDefinition: [
        app,
        "fileId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
      description: "The file to upload a new version of",
    },
    file: {
      propDefinition: [
        app,
        "file",
      ],
    },
    modifiedAt: {
      propDefinition: [
        app,
        "modifiedAt",
      ],
    },
    fileName: {
      propDefinition: [
        app,
        "fileName",
      ],
      description: "An optional new name for the file. If specified, the file will be renamed when the new version is uploaded.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    getFileUploadBody,
  },
  async run({ $ }) {
    const {
      file, fileId, createdAt, modifiedAt, fileName, parentId,
    } = this;
    const data = await this.getFileUploadBody({
      file,
      createdAt,
      modifiedAt,
      fileName,
      parentId,
    });
    const response = await this.app.uploadFileVersion({
      $,
      fileId,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      },
      data,
    });
    $.export("$summary", `File version with ID (${response?.entries[0]?.file_version.id}) successfully uploaded.`);
    return response;
  },
};
