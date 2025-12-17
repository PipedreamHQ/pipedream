import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-generate-pdf-from-document",
  name: "Generate PDF from Document",
  description: "Generate PDF of a document and return PDF URL.",
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
    background_mode: {
      type: "boolean",
      label: "Background Mode",
      description: "Whether to generate pdf in background mode or not.",
      optional: true,
    },
  },
  async run() {
    const apiUrl = `${this.croveApp._getBaseUrl()}/documents/${this.document_id}/generate-pdf/`;
    var config = {
      url: apiUrl,
      method: "POST",
      data: {
        background_mode: this.background_mode,
      },
    };
    let response = await this.croveApp._makeRequest(config);

    // Removing returned properties that are not interesting for users
    delete response.response;
    delete response.respondents;
    delete response.symbol_table;
    return response;
  },
};
