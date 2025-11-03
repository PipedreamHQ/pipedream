import app from "../../box.app.mjs";
import { getFileUploadBody } from "../../common/common-file-upload.mjs";

export default {
  name: "Upload File Version",
  description: "Update a file's content. [See the documentation](https://developer.box.com/reference/post-files-id-content/).",
  key: "box-upload-file-version",
  version: "0.1.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "Folder containing the file to update",
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
