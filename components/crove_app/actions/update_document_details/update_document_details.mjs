import croveApp from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crove_app-update-document-details",
  name: "Update Document Details",
  description: "Update details of a document. Example: Name, Current Status, etc.",
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
  async run({ $ }) {
    const apiUrl = `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/update/`;
    return await axios($, {
      url: apiUrl,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
      data: {
        name: this.name,
        sent: this.sent,
        opened: this.opened,
      },
    });
  },
};
