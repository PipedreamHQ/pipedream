import agrello from "../../agrello.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agrello-get-document",
  name: "Get Document",
  description: "Get a document in Agrello. [See the documentation](https://api.agrello.io/public/webjars/swagger-ui/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agrello,
    documentId: {
      propDefinition: [
        agrello,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.agrello.getDocument({
      documentId: this.documentId,
    });
    $.export("$summary", `Successfully retrieved document with ID ${this.documentId}`);
    return response;
  },
};
