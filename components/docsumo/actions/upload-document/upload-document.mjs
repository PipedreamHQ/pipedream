import app from "../../docsumo.app.mjs";
import options from "../../common/options.mjs";

export default {
  name: "Upload Document",
  description: "Upload file using URL or base64 [See the documentation](https://support.docsumo.com/reference/post_api-v1-eevee-apikey-upload-custom).",
  key: "docsumo-upload-document",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    fileType: {
      type: "string",
      label: "File Type",
      description: "Type of file to be uploaded",
      options: options.FILE_TYPES,
    },
    documentType: {
      propDefinition: [
        app,
        "documentType",
      ],
    },
    file: {
      type: "string",
      label: "File",
      description: "Url or base64 string based on file_type",
    },
    userDocId: {
      type: "string",
      label: "User Doc Id",
      description: "User defined document id",
      optional: true,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Name of the file",
      optional: true,
    },
    docMetadata: {
      type: "string",
      label: "Doc Metadata",
      description: "Metadata of the document",
      optional: true,
    },
    reviewToken: {
      type: "string",
      label: "Review Token",
      description: "Review token for the document",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for the document",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      file_type: this.fileType,
      type: this.documentType,
      file: this.file,
      user_doc_id: this.userDocId,
      filename: this.fileName,
      review_token: this.reviewToken,
      password: this.password,
      doc_meta_data: this.docMetadata,
    };
    const res = await this.app.uploadDocument(data, $);
    $.export("summary", `Document "${res.data.document[0].title}" successfully created.`);
    return res;
  },
};
