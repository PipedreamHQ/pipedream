import app from "../../box.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import utils from "../../common/utils.mjs";

export default {
  name: "Upload a File",
  description: "Uploads a small file to Box. [See the docs here](https://developer.box.com/reference/post-files-content/).",
  key: "box-upload-file",
  version: "0.0.1",
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
  async run({ $ }) {
    const fileValidation = utils.isValidFile(this.file);
    if (!fileValidation) {
      throw new ConfigurationError("`file` must be a valid file path!");
    }
    const fileMeta = utils.getFileMeta(fileValidation);
    const fileContent = utils.getFileStream(fileValidation);
    const attributes = fileMeta.attributes;
    if (this.createdAt && utils.checkRFC3339(this.createdAt)) {
      attributes.content_created_at = this.createdAt;
    }
    if (this.modifiedAt && utils.checkRFC3339(this.modifiedAt)) {
      attributes.content_modified_at = this.modifiedAt;
    }
    if (this.fileName) {
      attributes.name = this.fileName;
    }
    if (this.parentId) {
      attributes.parent.id = this.parentId;
    }
    const data = new FormData();
    data.append("attributes", JSON.stringify(attributes));
    data.append("file", fileContent, {
      knownLength: fileMeta.size,
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
