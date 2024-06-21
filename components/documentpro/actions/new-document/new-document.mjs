import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import documentpro from "../../documentpro.app.mjs";

export default {
  key: "documentpro-new-document",
  name: "Upload New Document",
  description: "Uploads a document to DocumentPro's parser. [See the documentation](https://docs.documentpro.ai/docs/using-api/manage-documents/import-files)",
  version: "0.0.1",
  type: "action",
  props: {
    documentpro,
    parserId: {
      propDefinition: [
        documentpro,
        "parserId",
      ],
    },
    document: {
      propDefinition: [
        documentpro,
        "document",
      ],
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    const file = fs.createReadStream(checkTmp(this.document));
    formData.append("file", file);

    const response = await this.documentpro.uploadDocument({
      parserId: this.parserId,
      data: formData,
      headers: formData.getHeaders(),
    });

    $.export("$summary", `Successfully uploaded document with Id: ${response.request_id}`);
    return response;
  },
};
