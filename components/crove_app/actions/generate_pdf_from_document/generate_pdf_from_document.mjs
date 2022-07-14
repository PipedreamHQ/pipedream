import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-generate-pdf-from-document",
  name: "Generate PDF from Document",
  description: "Generate PDF of a document and return PDF URL.",
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
    return await this.croveApp._makeRequest(config);
  },
};
