import docparser from "../../docparser.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "docparser-fetch-document-url",
  name: "Fetch Document by URL",
  description: "Fetches a document from a provided URL and imports it to Docparser for parsing. [See the documentation](https://docparser.com/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    docparser,
    url: {
      propDefinition: [
        docparser,
        "url",
      ],
    },
    parserId: {
      propDefinition: [
        docparser,
        "parserId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docparser.fetchDocumentFromURL({
      parserId: this.parserId,
      url: this.url,
    });

    $.export("$summary", `Document is scheduled to be fetched and processed. Document ID: ${response.document_id}`);
    return response;
  },
};
