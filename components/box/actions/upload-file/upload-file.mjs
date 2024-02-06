import app from "../../box.app.mjs";
import { getFileUploadBody } from "../../common/common-file-upload.mjs";

export default {
  name: "Upload a File",
  description: "Uploads a small file to Box. [See the documentation](https://developer.box.com/reference/post-files-content/).",
  key: "box-upload-file",
  version: "0.0.3",
  type: "action",
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
  },
  methods: {
    getFileUploadBody,
  },
  async run({ $ }) {
    const {
      file, createdAt, modifiedAt, fileName, parentId,
    } = this;
    const data = this.getFileUploadBody({
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
