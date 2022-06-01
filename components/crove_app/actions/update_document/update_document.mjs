import croveApp from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crove_app-update-document",
  name: "Update Document",
  description: "Update values of variables of a document.",
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
      reloadProps: true,
    },
  },
  async additionalProps() {
    let documentId = this.document_id;
    let config = {
      url: `https://v2.api.crove.app/api/integrations/external/documents/${documentId}/`,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "GET",
    };
    let resp = await this.croveApp._makeRequest(config);
    let symbolTable = resp.symbol_table;
    let props = {};
    for (var k in symbolTable) {
      props[k] = {
        type: "string",
        label: symbolTable[k].name,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {

    let resp = await axios($, {
      url: `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/`,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "GET",
    });

    let symbolTable = resp.symbol_table;
    let response = {};
    for (var k in symbolTable) {
      response[k] = this[k];
    }

    const apiUrl = `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/update-response/`;
    return await axios($, {
      url: apiUrl,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
      data: {
        response: response,
      },
    });
  },
};
