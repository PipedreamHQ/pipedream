import app from "../../pandadoc.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "pandadoc-create-document-attachment",
  name: "Create Document Attachment",
  description: "Adds an attachment to a document. [See the documentation here](https://developers.pandadoc.com/reference/create-document-attachment)",
  type: "action",
  version: "0.1.0",
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
  },
  methods: {
    async getFormData(file, fileName) {
      const {
        stream, metadata: {
          name, size,
        },
      } = await getFileStreamAndMetadata(file);
      const data = new FormData();
      data.append("name", fileName || name);
      data.append("file", stream, {
        knownLength: size,
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
