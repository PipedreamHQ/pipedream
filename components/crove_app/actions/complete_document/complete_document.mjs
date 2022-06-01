import croveApp from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crove_app-complete-document",
  name: "Complete Document",
  description: "Mark the document as completed",
  version: "0.0.1",
  type: "action",
  props: {
    croveApp,
    document_id: {
      type: "string",
      label: "Document ID",
      description: "Document ID of document.",
      async options({ $ }) {
        var resp = await axios($, {
          url: "https://v2.api.crove.app/api/integrations/external/documents/?limit=50",
          headers: {
            "X-API-KEY": `${this.croveApp.$auth.api_key}`,
          },
          method: "GET",
        });
        resp = resp.results;
        return resp.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
  },
  async run({ $ }) {
    const apiUrl = `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/complete/`;
    return await axios($, {
      url: apiUrl,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
    });
  },
};
