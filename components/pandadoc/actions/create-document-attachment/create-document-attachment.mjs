import app from "../../pandadoc.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "pandadoc-create-document-attachment",
  name: "Create Document Attachment",
  description: "Adds an attachment to a document. [See the documentation here](https://developers.pandadoc.com/reference/create-document-attachment)",
  type: "action",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
    file: {
      propDefinition: [
        app,
        "file",
      ],
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "A name you want to set for a file in the system",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    async getFormData(file, fileName) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(file);
      const data = new FormData();
      data.append("name", fileName || metadata.name);
      data.append("file", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
      return data;
    },
  },
  async run({ $ }) {
    const {
      documentId,
      file,
      fileName,
    } = this;

    const data = await this.getFormData(file, fileName);

    const response = await this.app.createDocumentAttachments({
      $,
      documentId,
      data,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      },
    });

    $.export("$summary", `Successfully created document attachment with ID: ${response.uuid}`);
    return response;
  },
};
