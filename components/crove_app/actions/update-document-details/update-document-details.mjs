import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-update-document-details",
  name: "Update Document Details",
  description: "Update details of a document. Example: Name, Current Status, etc.",
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
    name: {
      type: "string",
      label: "Name",
      description: "Name of document.",
    },
    sent: {
      type: "boolean",
      label: "Sent",
      description: "Document sent or not.",
      optional: true,
    },
    opened: {
      type: "boolean",
      label: "Opened",
      description: "Document opened or not.",
      optional: true,
    },
  },
  async run() {
    const apiUrl = `${this.croveApp._getBaseUrl()}/documents/${this.document_id}/update/`;
    const config = {
      url: apiUrl,
      method: "POST",
      data: {
        name: this.name,
        sent: this.sent,
        opened: this.opened,
      },
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
