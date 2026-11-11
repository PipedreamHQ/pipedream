import app from "../../box.app.mjs";
import { getFileUploadBody } from "../../common/common-file-upload.mjs";

export default {
  name: "Upload a File",
  description: "Uploads a file (max 50MB — Box's limit for direct uploads) to a Box folder. The file name must be unique within the parent folder (case-insensitive). Provide either a file URL or a path to a file in the `/tmp` directory. Use **Upload File Version** to update an existing file's content instead. [See the documentation](https://developer.box.com/reference/post-files-content/).",
  key: "box-upload-file",
  version: "0.1.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    file: {
      propDefinition: [
        app,
        "file",
      ],
    },
    createdAt: {
      propDefinition: [
        app,
        "createdAt",
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
    },
    parentId: {
      propDefinition: [
        app,
        "parentId",
      ],
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
      file, createdAt, modifiedAt, fileName, parentId,
    } = this;
    const data = await this.getFileUploadBody({
      file,
      createdAt,
      modifiedAt,
      fileName,
      parentId,
    });
    const response = await this.app.uploadFile({
      $,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      },
      data,
    });
    $.export("$summary", `File with ID(${response?.entries[0]?.id}) successfully uploaded.`);
    return response;
  },
};
