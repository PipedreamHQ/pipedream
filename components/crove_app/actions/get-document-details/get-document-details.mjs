import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-get-document-details",
  name: "Get Document Details",
  description: "Get details of a document. Example: Name, Current Status, etc.",
  version: "0.0.2",
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
    return await this.croveApp._makeRequest(config);
  },
};
