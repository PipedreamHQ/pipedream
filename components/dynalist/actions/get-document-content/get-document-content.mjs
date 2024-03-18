import dynalist from "../../dynalist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dynalist-get-document-content",
  name: "Get Document Content",
  description: "Fetches the content of a specific document. [See the documentation](https://apidocs.dynalist.io/)",
  version: "0.0.1",
  type: "action",
  props: {
    dynalist,
    documentId: {
      propDefinition: [
        dynalist,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dynalist.fetchDocumentContent({
      documentId: this.documentId,
    });
    $.export("$summary", `Successfully fetched content for document ID ${this.documentId}`);
    return response;
  },
};
