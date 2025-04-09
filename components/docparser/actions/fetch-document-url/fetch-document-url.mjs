import FormData from "form-data";
import docparser from "../../docparser.app.mjs";

export default {
  key: "docparser-fetch-document-url",
  name: "Fetch Document by URL",
  description: "Fetches a document from a provided URL and imports it to Docparser for parsing. [See the documentation](https://docparser.com/api/)",
  version: "0.0.1",
  type: "action",
  props: {
    docparser,
    parserId: {
      propDefinition: [
        docparser,
        "parserId",
      ],
    },
    url: {
      type: "string",
      label: "Document URL",
      description: "The URL of the document to be fetched and imported into Docparser.",
    },
  },
  async run({ $ }) {
    const data = new FormData();
    data.append("url", this.url);

    const response = await this.docparser.fetchDocumentFromURL({
      $,
      parserId: this.parserId,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Document is scheduled to be fetched and processed. Document ID: ${response.document_id}`);
    return response;
  },
};
