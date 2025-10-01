import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-send-document",
  name: "Send Document",
  description: "Send email invitation link to fill & sign the document.  ",
  version: "0.0.5",
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
    email: {
      type: "string",
      label: "Email",
      description: "Email to which document is to be sent.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message is to be sent along with document.",
      optional: true,
    },
  },
  async run() {
    const apiUrl = `${this.croveApp._getBaseUrl()}/documents/${this.document_id}/email-invites/create/`;
    const config = {
      url: apiUrl,
      method: "POST",
      data: {
        email: this.email,
        message: this.message,
      },
    };
    return await this.croveApp._makeRequest(config);
  },
};
