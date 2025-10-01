import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-submit-document",
  name: "Submit Document",
  description: "Submit the document like you do it via Crove form.",
  version: "1.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    const apiUrl = `${this.croveApp._getBaseUrl()}/documents/${this.document_id}/submit-response/`;
    const config = {
      url: apiUrl,
      method: "POST",
    };
    let response = await this.croveApp._makeRequest(config);

    // Removing returned properties that are not interesting for users
    delete response.response;
    delete response.respondents;
    delete response.symbol_table;
    return response;
  },
};
