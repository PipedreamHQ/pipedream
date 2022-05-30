import crove_app from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crove_app-generate-template-pdf",
  name: "Generate Document PDF From Template",
  description: "Generate PDF of a document created from the template",
  version: "0.0.1",
  type: "action",
  props: {
    crove_app,
    template_id: {
      type: "string",
      label: "Template ID",
      async options({ $ }){
          var resp = await axios($, {
              url: "https://v2.api.crove.app/api/integrations/external/templates/?limit=50",
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
    let template_id = this.template_id;
    let config = {
      url: `https://v2.api.crove.app/api/integrations/external/templates/${template_id}/`,
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
      url: `https://v2.api.crove.app/api/integrations/external/documents/create/`,
      headers: {
        'X-API-KEY': `${this.crove_app.$auth.api_key}`,
      },
      method: "POST",
      data: {
          template_id: this.template_id,
      }
    });

    let document_id = resp.id;

    resp = await axios($, {
      url: `https://v2.api.crove.app/api/integrations/external/templates/${this.template_id}/`,
      headers: {
        'X-API-KEY': `${this.crove_app.$auth.api_key}`,
      },
      method: "GET",
    });

    let symbol_table = resp.symbol_table;
    let response = {};
    for(var k in symbol_table) {
      response[k] = this[k];
    }

    const api_url = `https://v2.api.crove.app/api/integrations/external/documents/${document_id}/update-response/`;
    resp =  await axios($, {
        url: api_url,
        headers: {
          'X-API-KEY': `${this.crove_app.$auth.api_key}`,
        },
        method: "POST",
        data: {
          response: response
        }
    });

    resp =  await axios($, {
        url: `https://v2.api.crove.app/api/integrations/external/documents/${ document_id }/submit-response/`,
        headers: {
          'X-API-KEY': `${this.crove_app.$auth.api_key}`,
        },
        method: "POST",
    });

    resp =  await axios($, {
        url: `https://v2.api.crove.app/api/integrations/external/documents/${ document_id }/generate-pdf/`,
        headers: {
          'X-API-KEY': `${this.crove_app.$auth.api_key}`,
        },
        method: "POST",
        data: {
            background_mode: false
        }
    });

    return resp;

  },
};