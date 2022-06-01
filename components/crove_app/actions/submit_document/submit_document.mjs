import croveApp from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crove_app-submit-document",
  name: "Submit Document",
  description: "Submit the document like you do it via Crove form.",
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
  },
  async run({ $ }) {
    const apiUrl = `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/submit-response/`;
    return await axios($, {
      url: apiUrl,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
    });
  },
};
