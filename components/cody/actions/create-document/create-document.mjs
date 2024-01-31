import cody from "../../cody.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cody-create-document",
  name: "Create Document",
  description: "Turn text content into a document and add it directly to your knowledge base. [See the documentation]()",
  version: "0.0.1",
  type: "action",
  props: {
    cody,
    documentText: cody.propDefinitions.documentText,
    documentTitle: {
      ...cody.propDefinitions.documentTitle,
      optional: true,
    },
    documentCategory: {
      ...cody.propDefinitions.documentCategory,
      optional: true,
    },
    documentAuthor: {
      ...cody.propDefinitions.documentAuthor,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.cody.createDocument({
      documentText: this.documentText,
      documentTitle: this.documentTitle,
      documentCategory: this.documentCategory,
      documentAuthor: this.documentAuthor,
    });
    $.export("$summary", `Successfully created document with title "${this.documentTitle
      ? this.documentTitle
      : "Untitled"}"`);
    return response;
  },
};
