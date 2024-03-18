import dynalist from "../../dynalist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dynalist-insert-document-content",
  name: "Insert Document Content",
  description: "Inserts content to a specific document. If the document has existing content, the new content will be appended. [See the documentation](https://apidocs.dynalist.io/)",
  version: "0.0.1",
  type: "action",
  props: {
    dynalist,
    documentId: dynalist.propDefinitions.documentId,
    contentToInsert: dynalist.propDefinitions.contentToInsert,
  },
  async run({ $ }) {
    const response = await this.dynalist.insertContentToDocument({
      documentId: this.documentId,
      contentToInsert: this.contentToInsert,
    });
    $.export("$summary", `Successfully inserted content to document ${this.documentId}`);
    return response;
  },
};
