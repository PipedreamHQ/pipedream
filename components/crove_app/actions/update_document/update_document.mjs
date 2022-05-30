import crove_app from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crove_app-update-document",
  name: "Update Document",
  description: "Update values of variables of a document.",
  version: "0.0.1",
  type: "action",
  props: {
    crove_app,
    document_id: {
      type: "string",
      label: "Document ID",
      async options({ $ }){
          var resp = await axios($, {
              url: "https://v2.api.crove.app/api/integrations/external/documents/?limit=50",
              headers: {
                  'X-API-KEY': `${this.crove_app.$auth.api_key}`,
              },
              method: "GET"
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
    let document_id = this.document_id;
    let config = {
      url: `https://v2.api.crove.app/api/integrations/external/documents/${document_id}/`,
      headers: {
        'X-API-KEY': `${this.crove_app.$auth.api_key}`,
      },
      method: "GET",
    }
    let resp = await this.crove_app._makeRequest(config);
    let symbol_table = resp.symbol_table;
    let props = {};
    for(var k in symbol_table) {
      props[k] = {
        type: "string",
        label: symbol_table[k].name,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {

    let resp = await axios($, {
      url: `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/`,
      headers: {
        'X-API-KEY': `${this.crove_app.$auth.api_key}`,
      },
      method: "GET",
    })

    let symbol_table = resp.symbol_table;
    let response = {};
    for(var k in symbol_table) {
      response[k] = this[k];
    }

    const api_url = `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/update-response/`;
    return await axios($, {
        url: api_url,
        headers: {
          'X-API-KEY': `${this.crove_app.$auth.api_key}`,
        },
        method: "POST",
        data: {
          response: response
        }
    });
  },
};