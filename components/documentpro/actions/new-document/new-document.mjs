import documentpro from "../../documentpro.app.mjs";
import { axios } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "documentpro-new-document",
  name: "Upload New Document",
  description: "Uploads a document to DocumentPro's parser. [See the documentation](https://docs.documentpro.ai/docs/using-api/manage-documents/import-files)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    documentpro,
    document: {
      propDefinition: [
        documentpro,
        "document",
      ],
    },
    mimeType: {
      propDefinition: [
        documentpro,
        "mimeType",
      ],
    },
    parserId: {
      propDefinition: [
        documentpro,
        "parserId",
      ],
    },
  },
  async run({ $ }) {
    const {
      parserId, document, mimeType,
    } = this;

    const formData = new FormData();
    formData.append("file", document);

    const response = await this.documentpro.uploadDocument({
      parserId,
      document,
      mimeType,
    });

    $.export("$summary", `Successfully uploaded document with parser ID ${parserId}`);
    return response;
  },
};
