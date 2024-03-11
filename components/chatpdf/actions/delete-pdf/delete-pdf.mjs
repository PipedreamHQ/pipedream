import chatpdf from "../../chatpdf.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chatpdf-delete-pdf",
  name: "Delete PDF",
  description: "Deletes one or more PDFs from ChatPDF using their source IDs. [See the documentation](https://www.chatpdf.com/docs/api/backend)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chatpdf,
    sourceIds: {
      propDefinition: [
        chatpdf,
        "sourceIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chatpdf.deletePdfs({
      sourceIds: this.sourceIds,
    });
    $.export("$summary", `Deleted PDFs with source IDs: ${this.sourceIds.join(", ")}`);
    return response;
  },
};
