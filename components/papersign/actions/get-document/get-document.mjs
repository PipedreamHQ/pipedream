import papersign from "../../papersign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "papersign-get-document",
  name: "Get Document",
  description: "Retrieve a document using a specified ID. [See the documentation](https://paperform.readme.io/reference/getpapersigndocument)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    papersign,
    documentId: {
      propDefinition: [
        papersign,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.papersign.getDocument({
      documentId: this.documentId,
    });

    $.export("$summary", `Successfully retrieved document with ID: ${this.documentId}`);
    return response;
  },
};
