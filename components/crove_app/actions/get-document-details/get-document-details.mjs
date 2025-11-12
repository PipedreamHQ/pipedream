import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-get-document-details",
  name: "Get Document Details",
  description: "Get details of a document. Example: Name, Current Status, etc.",
  version: "1.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    croveApp,
    document_id: {
      propDefinition: [
        croveApp,
        "document_id",
      ],
    },
  },
  async run() {
    const apiUrl = `${this.croveApp._getBaseUrl()}/documents/${this.document_id}`;
    const config = {
      url: apiUrl,
      method: "GET",
    };
    let response = await this.croveApp._makeRequest(config);

    // Removing returned properties that are not interesting for users
    delete response.response;
    delete response.respondents;
    delete response.symbol_table;
    return response;
  },
};
