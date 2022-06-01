import croveApp from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crove_app-send-document",
  name: "Send Document",
  description: "Send email invitation link to fill & sign the document.  ",
  version: "0.0.1",
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
  async run({ $ }) {
    const apiUrl = `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/email-invites/create/`;
    return await axios($, {
      url: apiUrl,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
      data: {
        email: this.email,
        message: this.message,
      },
    });
  },
};
