import chatpdf from "../../chatpdf.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chatpdf-add-pdf-via-url",
  name: "Add PDF via URL",
  description: "Adds a PDF from a publicly accessible URL to ChatPDF, returning a source ID for interactions. [See the documentation](https://www.chatpdf.com/docs/api/backend)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chatpdf,
    url: {
      propDefinition: [
        chatpdf,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chatpdf.addPdfByUrl({
      url: this.url,
    });
    const sourceId = response.sourceId;
    $.export("$summary", `Added PDF via URL and received source ID: ${sourceId}`);
    return {
      sourceId,
    };
  },
};
