import croveApp from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crove_app-generate-template-pdf",
  name: "Generate Document PDF From Template",
  description: "Generate PDF of a document created from the template",
  version: "0.0.1",
  type: "action",
  props: {
    croveApp,
    template_id: {
      propDefinition: [
        croveApp,
        "template_id",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    let templateId = this.template_id;
    let config = {
      url: `https://v2.api.crove.app/api/integrations/external/templates/${templateId}/`,
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
      url: "https://v2.api.crove.app/api/integrations/external/documents/create/",
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
      data: {
        template_id: this.template_id,
      },
    });

    let documentId = resp.id;

    resp = await axios($, {
      url: `https://v2.api.crove.app/api/integrations/external/templates/${this.template_id}/`,
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

    const apiUrl = `https://v2.api.crove.app/api/integrations/external/documents/${documentId}/update-response/`;
    resp =  await axios($, {
      url: apiUrl,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
      data: {
        response: response,
      },
    });

    resp =  await axios($, {
      url: `https://v2.api.crove.app/api/integrations/external/documents/${ documentId }/submit-response/`,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
    });

    resp =  await axios($, {
      url: `https://v2.api.crove.app/api/integrations/external/documents/${ documentId }/generate-pdf/`,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
      data: {
        background_mode: false,
      },
    });

    return resp;

  },
};
