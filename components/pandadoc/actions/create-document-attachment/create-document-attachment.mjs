import app from "../../pandadoc.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import path from "path";
import FormData from "form-data";

export default {
  key: "pandadoc-create-document-attachment",
  name: "Create Document Attachment",
  description: "Adds an attachment to a document. [See the documentation here](https://developers.pandadoc.com/reference/create-document-attachment)",
  type: "action",
  version: "0.0.7",
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
    isValidFile(filePath) {
      const filePathWithTmp = `/tmp/${filePath}`;
      if (fs.existsSync(filePathWithTmp)) {
        return filePathWithTmp;
      } else if (fs.existsSync(filePath)) {
        return filePath;
      }
      return false;
    },
    getFileStream(filePath) {
      return fs.createReadStream(filePath);
    },
    getFileMeta(filePath) {
      const stats = fs.statSync(filePath);
      return {
        name: path.basename(filePath),
        size: stats.size,
      };
    },
    getFormData(file, fileName) {
      const fileValidation = this.isValidFile(file);
      if (!fileValidation) {
        throw new ConfigurationError("`file` must be a valid file path!");
      }

      const fileMeta = this.getFileMeta(fileValidation);
      const fileContent = this.getFileStream(fileValidation);
      const data = new FormData();
      if (fileName) data.append("name", fileName);
      data.append("file", fileContent, {
        knownLength: fileMeta.size,
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

    const data = this.getFormData(file, fileName);

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
