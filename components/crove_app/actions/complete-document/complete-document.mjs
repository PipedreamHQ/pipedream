import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-complete-document",
  name: "Complete Document",
  description: "Mark the document as completed",
  version: "1.0.1",
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
    let response = await this.croveApp._makeRequest(config);
    // if response.response exist delete it
    if (response.response) {
      delete response.response;
    }
    // if response.respondents exist delete it
    if (response.respondents) {
      delete response.respondents;
    }
    // if response.symbol_table exist delete it
    if (response.symbol_table) {
      delete response.symbol_table;
    }
    return response;
  },
};
