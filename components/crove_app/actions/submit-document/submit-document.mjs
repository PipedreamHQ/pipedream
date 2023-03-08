import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-submit-document",
  name: "Submit Document",
  description: "Submit the document like you do it via Crove form.",
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
    const apiUrl = `${this.croveApp._getBaseUrl()}/documents/${this.document_id}/submit-response/`;
    const config = {
      url: apiUrl,
      method: "POST",
    };
    let response = this.croveApp._makeRequest(config);
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
