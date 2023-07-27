import app from "../../box.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import utils from "../../common/utils.mjs";

export default {
  name: "Upload File Version",
  description: "Update a file's content. [See the documentation](https://developer.box.com/reference/post-files-id-content/).",
  key: "box-upload-file-version",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const fileValidation = utils.isValidFile(this.file);
    if (!fileValidation) {
      throw new ConfigurationError("`file` must be a valid file path!");
    }
    const fileMeta = utils.getFileMeta(fileValidation);
    const fileContent = utils.getFileStream(fileValidation);
    const attributes = fileMeta.attributes;
    if (this.modifiedAt && utils.checkRFC3339(this.modifiedAt)) {
      attributes.content_modified_at = this.modifiedAt;
    }
    if (this.fileName) {
      attributes.name = this.fileName;
    }
    const data = new FormData();
    data.append("attributes", JSON.stringify(attributes));
    data.append("file", fileContent, {
      knownLength: fileMeta.size,
    });
    const response = await this.app.uploadFile({
      $,
      fileId: this.fileId,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      },
      data,
    });
    $.export("$summary", `Successfully updated file (ID ${this.fileId}).`);
    return response;
  },
};
