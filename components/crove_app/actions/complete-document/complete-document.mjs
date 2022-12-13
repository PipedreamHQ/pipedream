import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-complete-document",
  name: "Complete Document",
  description: "Mark the document as completed",
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
    const apiUrl = `${this.croveApp._getBaseUrl()}/documents/${this.document_id}/complete/`;
    const config = {
      url: apiUrl,
      method: "POST",
    };
    return await this.croveApp._makeRequest(config);
  },
};
