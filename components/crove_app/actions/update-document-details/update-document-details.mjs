import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-update-document-details",
  name: "Update Document Details",
  description: "Update details of a document. Example: Name, Current Status, etc.",
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
    return await this.croveApp._makeRequest(config);
  },
};
