import pdfmonkey from "../../pdfmonkey.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pdfmonkey-find-document",
  name: "Find Document",
  description: "Find a document within PDFMonkey. [See the documentation](https://docs.pdfmonkey.io/references/api/documents)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pdfmonkey,
    documentId: {
      propDefinition: [
        pdfmonkey,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const document = await this.pdfmonkey.findDocument(this.documentId);
    $.export("$summary", `Successfully found document with ID ${this.documentId}`);
    return document;
  },
};
